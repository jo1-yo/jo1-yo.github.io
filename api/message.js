// Vercel Serverless Function — POST /api/message
// Receives the contact form and forwards it to Jane's phone via Twilio SMS.
//
// Jane's phone number and ALL Twilio credentials live ONLY in Vercel
// environment variables (server-side). They never appear in this file,
// in index.html, in network responses, or anywhere the browser can see.
//
// Required env vars (Vercel → Project → Settings → Environment Variables):
//   TWILIO_ACCOUNT_SID   – from console.twilio.com
//   TWILIO_AUTH_TOKEN    – from console.twilio.com
//   TWILIO_FROM_NUMBER   – your Twilio phone number, E.164 (e.g. +1XXXXXXXXXX)
//   DESTINATION_PHONE    – the phone that receives the texts, E.164 (e.g. +1XXXXXXXXXX)

const twilio = require('twilio');

// Best-effort in-memory throttle (per warm instance). NOT a full substitute for a
// durable limiter — serverless instances are ephemeral and run in parallel, so a
// determined attacker can still get through. It does stop casual bursts / bot loops
// hitting one warm instance. For real protection: add a Vercel KV / Upstash counter
// (per-IP + a global daily cap) AND set a spend limit in the Twilio console.
const HITS = new Map(); // ip -> [timestamps]
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 4;

function rateLimited(ip) {
    const now = Date.now();
    const recent = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    recent.push(now);
    HITS.set(ip, recent);
    if (HITS.size > 5000) HITS.clear(); // bound memory
    return recent.length > MAX_PER_WINDOW;
}

// Browser same-origin POSTs send an Origin header. Non-browser clients can forge it,
// so this is only defense-in-depth (paired with the throttle above), never the sole gate.
function originAllowed(origin) {
    if (!origin) return true; // missing Origin (some same-origin / non-browser) → allow, throttle covers it
    try {
        const host = new URL(origin).hostname;
        return host === 'imjane.top' || host.endsWith('.imjane.top') ||
            host.endsWith('.vercel.app') || host === 'localhost';
    } catch (_) { return false; }
}

// Collapse CR/LF + runs of whitespace so single-line fields can't forge extra
// labeled lines ("Reply to: …") inside the SMS body.
const oneLine = (s) => String(s || '').replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }
    if (!originAllowed(req.headers.origin)) {
        return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    if (rateLimited(ip)) {
        return res.status(429).json({ success: false, message: 'Too many messages — please wait a moment.' });
    }

    // Vercel parses JSON bodies automatically; guard against a raw string just in case.
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
    body = body || {};

    // Honeypot — silently accept and drop bot submissions.
    if (body.botcheck) return res.status(200).json({ success: true });

    const name = oneLine(body.name).slice(0, 120);
    const contact = oneLine(body.contact).slice(0, 160);
    const message = String(body.message || '').trim().slice(0, 1200);

    if (!message) {
        return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, DESTINATION_PHONE } = process.env;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER || !DESTINATION_PHONE) {
        return res.status(500).json({ success: false, message: 'Messaging is not configured yet.' });
    }

    const text = [
        'New message from imjane.top',
        name ? `From: ${name}` : null,
        contact ? `Reply to: ${contact}` : null,
        '',
        message,
    ].filter((line) => line !== null).join('\n');

    try {
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        await client.messages.create({ to: DESTINATION_PHONE, from: TWILIO_FROM_NUMBER, body: text });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Twilio send failed:', err && err.message);
        return res.status(502).json({ success: false, message: 'Could not send right now — please try again.' });
    }
};
