import { useState } from 'react';
import './App.css';
import './normal.css';

function App() {
  const initialChatLog = [
    {
      role: "assistant",
      content: "Welcome to CuraLinkAI! I am Cura, your medical assistant. How can I help you?",
    },
  ];

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState(initialChatLog);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!input.trim()) {
      return; 
    }

    const userMessage = { role: "user", content: input };
    setChatLog((prevChatLog) => [...prevChatLog, userMessage]);
    setInput(""); 

    try {
      const response = await fetch("http://localhost:3080/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...chatLog, userMessage], 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setChatLog((prevChatLog) => [
        ...prevChatLog,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function clearChat() {
    setChatLog(initialChatLog); 
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <h1>CuraLinkAI</h1>
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span> New Chat
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input-textarea"
              placeholder="Type your medical inquiry here..."
            />
          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.role === "assistant" ? "curalinkai" : ""}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.role === "assistant" ? "curalinkai" : ""}`}>
          {message.role === "assistant" && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="lightblue">
              <path d="M83.411 125.74H44.329V99.408L20.871 112.89.16 77.84l23.532-13.838L0 50.156l20.898-35.048 23.431 13.483V2.26h39.082v26.333l23.358-13.484 20.662 35.048-23.559 13.846 23.681 13.838-20.805 35.051-23.337-13.484v26.332zm-30.854-8.232h22.627V84.662l28.671 16.658 12.068-20.453-28.759-16.865 28.839-16.873-12.162-20.45-28.658 16.659V10.492H52.557V43.34L23.786 26.68 11.667 47.13l28.731 16.873L11.55 80.867l12.256 20.453 28.751-16.658v32.846z" />
            </svg>
          )}
          {message.role === "user" && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="white">
              <path d="M47 24A23 23 0 1 1 12.81 3.91 23 23 0 0 1 47 24z" fill="#374f68" />
              <path d="M47 24a22.91 22.91 0 0 1-8.81 18.09A22.88 22.88 0 0 1 27 45C5.28 45-4.37 17.34 12.81 3.91A23 23 0 0 1 47 24z" fill="#425b72" />
              <circle cx="24" cy="24" r="10" fill="#6fabe6" />
              <path d="M24 35c-5.52 0-10 3.88-10 9h20c0-5.12-4.48-9-10-9z" fill="#82bcf4" />
            </svg>
          )}
        </div>
        <div className="message">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default App;

