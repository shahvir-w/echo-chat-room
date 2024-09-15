import React from 'react';
import { TbMessageFilled } from "react-icons/tb";

const JoinChatForm = ( {onJoin, setUsername, username, setRoomId, roomId} ) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoin();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100">

      <div className="flex flex-row gap-3">
        <h1 className="text-5xl font-bold mb-8 text-blue-400">Echo Chat</h1>
        <TbMessageFilled className="text-blue-400 text-6xl mb-8" />
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-3xl font-semibold text-center mb-6">join a chat room</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />

          <input
            type="text"
            placeholder="Enter a room name"
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
          />

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            join room
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinChatForm;