import React, { useEffect, useRef, useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { FaArrowUp, FaUpload } from "react-icons/fa";
import "./ChatInterface.css";
import ChatInterfaceNavbar from "./ChatInterfaceNavbar";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const socket = useRef(null);
  const lineHeight = 24; // px (adjust if your font size is different)
  const maxRows = 6;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = lineHeight * maxRows;

      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
    }
  }, [input]);

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8000/ws");

    socket.current.onmessage = (event) => {
      setMessages((prev) => [...prev, { sender: "server", text: event.data }]);
    };

    socket.current.onopen = () => {
      console.log("WebSocket connected");
    };

    return () => {
      socket.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.current.send(input);
      setMessages((prev) => [...prev, { sender: "user", text: input }]);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

  return (
    <div className="chat-container">
      <ChatInterfaceNavbar />
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="w-75">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-1 fs-14 text-${
                msg.sender === "user" ? "end" : "start"
              }`}
            >
              <span
                className={`d-inline-block chat-window-text ${
                  msg.sender === "user" ? "user-text" : "bg-light"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`chat-input-container d-flex align-items-center justify-content-center p-1  flex-column gap-3 ${
          messages.length > 0 ? "field-bottom" : "field-center"
        } `}
      >
        {messages.length > 0 ? (
          <></>
        ) : (
          <h4>Upload Logs and Start Analysing!</h4>
        )}

        <InputGroup className="chat-interface-input-group">
          <FormControl
            as="textarea"
            placeholder="Enter something..."
            className="chat-interface-input-text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            onKeyDown={handleKeyDown}
            ref={textareaRef}
            style={{
              resize: "none",
              overflowY: "hidden", // default state
              maxHeight: `${lineHeight * maxRows}px`,
              lineHeight: `${lineHeight}px`,
            }}
            autoFocus
          />
          <button
            className="chat-interface-input-send-button"
            onClick={sendMessage}
          >
            <FaArrowUp />
          </button>
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatInterface;
