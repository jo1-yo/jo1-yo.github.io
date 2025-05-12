const express = require('express');
const app = express();
const PORT = 3000;

// 提供静态文件
app.use(express.static('public'));

// API 路由
app.get('/api/data', (req, res) => {
    const data = { message: '这是从服务器获取的数据！' };
    res.json(data);
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});

