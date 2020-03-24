const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let onlineCount = 0;
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile( __dirname + '/view/index.html');
});

app.use('/css', express.static('css'));
app.use('/asset', express.static('asset'));

io.on('connection', (socket) => {
    onlineCount++;
    io.emit("online", onlineCount);

    socket.on("greet", () => {
        console.log('greet');
        socket.emit("greet", "Hi! Client.");
    });

    socket.on('disconnect', () => {
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online", onlineCount);
    });

    socket.on("send", (msg) => {
        if (Object.keys(msg).length < 2) return;
        io.emit("msg", msg);
    });

});

server.listen(port, () => {
    console.log(`Listening on ${port}`);
});