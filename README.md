# Jane Zhang — Personal Website

Live at **[imjane.top](https://imjane.top)**

## Views

| View | Description |
|---|---|
| **Tree Portfolio** (`index.html`) | Interactive 3D tree with seasons (Spring → Summer → Autumn). Click the apples/animals/leaves to explore projects. |
| **Classic View** (`index-classic.html`) | Standard portfolio layout with project cards, contact, and social links. |

## Project Pages

- `gensync.html` — Gensync: intergenerational learning platform
- `suab.html` — SUAB: Student Union Against Bullying
- `traller.html` — Traller: travel trailer app

## Structure

```
├── index.html              # Tree portfolio (main entry)
├── index-classic.html      # Classic portfolio view
├── gensync.html
├── suab.html
├── traller.html
├── css/                    # Stylesheets for gensync page
│   ├── main.css
│   └── parallax.css
├── images/                 # All images
└── videos/                 # All videos (logo, gensync demos)
```

## Run Locally

**Node.js**
```bash
node server.js
# → http://localhost:3000
```

**Python**
```bash
python simple_server.py
# → http://localhost:8000
```

## Tech Stack

HTML5 · CSS3 · Vanilla JavaScript · Three.js (tree portfolio) · GitHub Pages
