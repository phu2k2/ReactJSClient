import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from "react";
  import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

  function App() {
    const [messages, setMessages] = useState([]);
    const connectionRef = useRef(null);

    useEffect(() => {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7251/chathub")
        .build();

      connection.on("ReceiveMessage", (user, message) => {
        setMessages((prevMessages) => [...prevMessages, `${user} says ${message}`]);
      });

      connection.start().catch((err) => console.error(err.toString()));

      connectionRef.current = connection;

      // Clean up connection when component unmounts
      return () => connection.stop();
    }, []);

    const handleSendMessage = () => {
      const user = document.getElementById("userInput").value;
      const message = document.getElementById("messageInput").value;

      connectionRef.current.invoke("SendMessage", user, message).catch(
        (err) => console.error(err.toString())
      );
    };
  return (
    <div className="App">
      <div class="row">&nbsp;</div>
      <div class="row">
        <div class="col-2">User</div>
        <div class="col-4"><input type="text" id="userInput" /></div>
    </div>
    <div class="row">
        <div class="col-2">Message</div>
        <div class="col-4"><input type="text" id="messageInput" /></div>
    </div>
    <div class="row">&nbsp;</div>
    <div class="row">
        <div class="col-6">
            <button type="button" id="sendButton" onClick={handleSendMessage}>
            Send Message
            </button>
        </div>
    </div>
    <ul id="messagesList">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
  </div>
  );
}

export default App;
