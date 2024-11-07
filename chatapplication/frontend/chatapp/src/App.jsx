import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); 

  const sendMessage = () => {
    socket.emit("send_message", { message });
    setMessage(""); 
  };

  useEffect(() => {
    socket.on("received_data", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]); 
    });

    return () => {
      socket.off("received_data");
    };
  }, []);

  return (
    <div className="min-h-screen justify-center items-center flex flex-col">
      <input
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 rounded-md"
      />
      <button
        className="border bg-blue-600 p-2 text-white rounded-md mt-2"
        onClick={sendMessage}
      >
        Send
      </button>
      
      <div className="mt-4">
        <h2>Messages:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li> 
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
