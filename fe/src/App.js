import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Messages from "./components/Messages";
import './App.css'
const socket = io("http://localhost:8080");

function App() {
  const first_name_ref = useRef();
  const last_name_ref = useRef();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const handleReceive = (data) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  }
  
  useEffect(() => {
    socket.on("receive", handleReceive);
    socket.on("get-users", handleGetUsers);
    handleGetUsers();
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

  const handleRegister = async (e) => {
    e.preventDefault();
    const first_name = first_name_ref.current.value;
    const last_name = last_name_ref.current.value;

    const payload = { first_name, last_name };
    
    await fetch("http://127.0.0.1:8000/api/v1/user", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    socket.emit('register', payload);
  }

  const handleGetUsers = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/v1/user");
    if(response.ok){
      const data = await response.json();
      setUsers(data);
    }
  }

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
      <form onSubmit={handleRegister}>
        <input name="first_name" ref={first_name_ref} />
        <br />
        <input name="last_name" ref={last_name_ref} />
        <button type="submit">Send</button>
      </form>
      <ul className="text-white">
        {
          users.map((user) => (<li><strong>{user.id}</strong> { user.full_name }</li>))
        }
      </ul>
    </div>
  );
}

export default App;
