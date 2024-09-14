const ws = require("ws")

const wsServer = new ws.WebSocketServer({
    port: 3001
})
wsServer.on("connection", (socket) => {
    socket.on("message", (data) => {
        console.log(data, "data");
    })
})