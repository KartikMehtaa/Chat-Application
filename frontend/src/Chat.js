import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function Chat() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/messages")
      .then(res => setMessages(res.data));

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (username && message) {
      socket.emit("sendMessage", { username, message });
      setMessage("");
    }
  };

  return (
    <div className="chat-box">
      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="messages">
        {messages.map((msg, i) => (
          <p key={i}>
            <strong>{msg.username}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
