import React, { useEffect, useState } from 'react';
import { getFormattedTime } from '../../util';
import { v4 as uuidv4 } from 'uuid';

const ChatScreen = ({ username, roomId, socket }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activityMsg, setActivityMsg] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentMessage(value);

    //emit activity detection to the server
    socket.emit("userTyping", {username, roomId})
  };

  useEffect(() => {
    // user typing detection
    let timer;

    socket.on("userTyping", (username) => {
      setActivityMsg(`${username} is typing...`);
      clearTimeout(timer);

      timer = setTimeout(() => {
        setActivityMsg("");
      }, 2000);
    })

    return () => {
      socket.off("userTyping");
    }
  }, [socket])
  
  useEffect(() => {
    // receiving messages from server
    socket.on("message", ({username, text, type}) => {
      const uuid = uuidv4();
      setMessages(prevMessages => [...prevMessages, {
        id: uuid,
        username,
        text,
        type
      }])
    })

    return () => {
      socket.off("message")
    }
  }, [socket])

  useEffect(() => {
    // notifying current user that another user has joined the room

    socket.on("userJoined", (message) => {
      const uuid = uuidv4();
      setMessages(prev => [...prev, {
        id: uuid,
        type: "notif",
        text: message
      }])
    })

    return () => {
      socket.off("userJoined");
    }
  }, [socket])

  useEffect(() => {
    // notifying users that another user has left the room


    const handleBeforeUnload = (e) => {
      socket.emit("userLeft", {username, roomId})
    }
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [username, roomId])

  const handleSendMessage = (e) => {
    e.preventDefault();


    // Add msg obj to the messages array
    const uuid = uuidv4();
    setMessages(prevMessages => [...prevMessages, {
      id: uuid,
      username,
      text: currentMessage
    }])

    //bradocast messages to others
    
    socket.emit("sendMessage", {
      username,
      roomId,
      text: currentMessage
    })

    setCurrentMessage("") 
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-100 p-4">
      {/* Room Info */}
      <div className="text-center mb-5" >
        <h2 className="text-3xl font-bold mb-3">Room Name: {roomId}</h2>
        <p className="text-lg mb-6">Welcome, <span className="text-blue-400">{username}</span></p>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col w-4/5 max-w-5xl h-[60vh] overflow-y-auto bg-gray-800 rounded-lg p-5 relative">
        {messages.map((message) => {
          const { id, text, type, username: messageUsername } = message || {};

          if (type === "notif") {
            return (
              <div
                key={id}
                className="flex text-center justify-center text-gray-400 mb-3"
              >
                {text}
              </div>
            );
          } else {
            return (
              <div
                key={id}
                className={`w-3/4 flex flex-row items-center justify-between px-3 mb-3 rounded-lg text-white ${
                  messageUsername === username
                    ? "bg-blue-600 self-end"
                    : "bg-gray-700 self-start"
                }`}
              >
                <div className="text-sm break-words my-2.5">
                  <span className="font-bold mr-1.5">{messageUsername}:</span>
                  <span>{text}</span>
                </div>
                <div className="text-xs whitespace-nowrap ml-1">
                  {getFormattedTime()}
                </div>
              </div>
            );
          }
        })}

        {/* Activity message positioned at the bottom */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 p-1 text-gray-400">
          {activityMsg}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="w-[75%] max-w-5xl mt-5 flex items-center">

        <input
          type="text"
          placeholder="Type your messages..."
          value={currentMessage}
          onChange={handleInputChange}
          className="flex-1 px-4 py-2 mr-3 bg-gray-900 text-gray-100 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >Send</button>
      </form>
    </div>
  );
};

export default ChatScreen;