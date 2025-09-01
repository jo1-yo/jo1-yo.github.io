const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// 提供根目录下的静态文件
app.use(express.static(__dirname));

// 提供media目录下的视频和图片
app.use('/media', express.static(path.join(__dirname, 'media')));

// 提供images目录下的图片
app.use('/images', express.static(path.join(__dirname, 'images')));

// 添加路由重定向，访问/gensync时重定向到gensync.html
app.get('/gensync', (req, res) => {
    res.redirect('/gensync.html');
});

// API 路由
app.get('/api/data', (req, res) => {
    const data = { message: '这是从服务器获取的数据！' };
    res.json(data);
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
