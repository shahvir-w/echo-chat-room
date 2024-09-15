import { io } from "socket.io-client"
import JoinChatForm from "./components/joinChat/JoinChatForm";

// Initializing the connection
const socket = io("http://localhost:3001")

function App() {
  return (
    <div>
      <JoinChatForm />
    </div>
  );
}

export default App;
