import { io } from "socket.io-client"
import JoinChatForm from "./components/joinChat/JoinChatForm";
import ChatScreen from "./components/ChatScreen/ChatScreen";
import { useEffect, useState } from "react";

// Initializing the connection
const socket = io("http://localhost:3001")

function App() {
  
  const [isChatting, setIsChatting] = useState(false);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connection has been established")
    })

    return () => {
      socket.off("connect")
    }
  }, [])
  
  const handleJoinRoom = () => {
    console.log("username:", username)
    console.log("roomId:", roomId)

    //add user to the room
    socket.emit("userJoinRoom", { username, roomId})

    //toggle user to go to chat window
    setIsChatting(true);
  }
  
  return (
    <div>
      {isChatting ? <ChatScreen username={username} roomId={roomId} socket={socket} /> 
      : <JoinChatForm  onJoin={handleJoinRoom}
        setUsername={setUsername} username={username}
        setRoomId={setRoomId} roomId={roomId}
        />}
      
    </div>
  );
}

export default App;
