const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let onlineCount = 0;
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile( __dirname + '/view/index.html');
});

//express放靜態資源
app.use('/css', express.static('css'));
app.use('/asset', express.static('asset'));

//socket連接
io.on('connection', (socket) => {
    //連接上+1
    onlineCount++;
    io.emit("online", onlineCount);

    //離開連接-1
    socket.on('disconnect', () => {
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online", onlineCount);
    });

    //接受到有人送出訊息
    socket.on("send", (msg) => {
        if (Object.keys(msg).length < 2) return;
        io.emit("msg", msg);
    });

});

server.listen(port, () => {
    console.log(`Listening on ${port}`);
});