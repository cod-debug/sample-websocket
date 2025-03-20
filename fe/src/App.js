import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Messages from "./components/Messages";
import './App.css'
const socket = io("http://localhost:8080");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleReceive = (data) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  }
  
  useEffect(() => {
    socket.on("receive", handleReceive);

    return () => {
      socket.off("receive");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message.trim()) {
      socket.emit("send", {message:message, clientId: socket.id});
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Sample Websocket</h2>
      <div style={{ marginBottom: "10px" }}>
        <Messages messages={messages} mySocketId={socket.id} />
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button>Send</button>
      </form>
    </div>
  );
}

export default App;
