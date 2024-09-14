const { Server } = require("socket.io");
const http = require("http");

const httpServer = http.createServer();

httpServer.listen(3001);

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {

    console.log(`User with id: ${socket.id.substring(0,5)} is connected`);

    socket.on("message", (data) => {
        console.log(data)
        io.emit("message", `${socket.id.substring(0,5)}: ${data}`)
    });
});