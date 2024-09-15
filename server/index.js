import { Server } from "socket.io"
import express from "express"

const app = express();

const PORT = process.env.PORT || 3001;

const httpServer = app.listen(PORT, () => {
    console.log(`Server is now listening to PORT ${PORT}`)
});

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log(`User ${socket.id.substring(0, 5)} is connected`);

    // Handling user joining the room
    socket.on("userJoinRoom", (data) => {
        const { username, roomId } = data || {};
        socket.join(roomId);

        socket.to(roomId).emit("userJoined", `${username} has joined the chat`);
        console.log(`${username} has joined the room ${roomId}`);
    });

    // Broadcast message to everyone in the room
    socket.on("sendMessage", ({ username, roomId, text }) => {
        socket.to(roomId).emit("message", { username, text, type: "regular" });
    });

    // Handling user leaving the room
    socket.on("userLeft", ({ username, roomId}) => {
        socket.to(roomId).emit("message", {username, text: `${username} has left the chat`, type: "notif"})
    })

    // Handling activity detection
    socket.on("userTyping", ({username, roomId}) => {
        socket.to(roomId).emit("userTyping", username);
    })
});