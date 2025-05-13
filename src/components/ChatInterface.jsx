import React, { useEffect, useRef, useState } from "react";
import { FormControl, InputGroup } from "react-bootstrap";
import { FaArrowUp } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "./ChatInterface.css";
import ChatInterfaceNavbar from "./ChatInterfaceNavbar";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const textareaRef = useRef(null);
  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const lineHeight = 24;
  const maxRows = 6;

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8000/ws");

    socket.current.onopen = () => console.log("WebSocket connected");
    socket.current.onerror = (err) => console.error("WebSocket error:", err);
    socket.current.onclose = (event) =>
      console.warn("WebSocket closed:", event.reason);

    socket.current.onmessage = (event) => {
      const token = event.data;
      console.log("Received token:", JSON.stringify(token)); // Log with JSON.stringify to see exact content

      if (token === "[DONE]") {
        setIsStreaming(false);
        return;
      }

      setMessages((prevMessages) => {
        const lastMessage =
          prevMessages.length > 0
            ? prevMessages[prevMessages.length - 1]
            : null;

        if (lastMessage && lastMessage.sender === "bot") {
          // Last message was from bot, append token to it
          const updatedMessages = prevMessages.map((msg, index) => {
            if (index === prevMessages.length - 1) {
              // This is the last message, update its text
              return { ...msg, text: msg.text + token };
            }
            return msg; // Other messages remain unchanged
          });
          return updatedMessages;
        } else {
          // No messages yet, or last message was from user, so add new bot message
          return [...prevMessages, { sender: "bot", text: token }];
        }
      }); // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // This is better placed in a useEffect hook watching [messages]
    };

    return () => {
      socket.current.close();
    };
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = lineHeight * maxRows;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.current.send(input);
      setMessages((prev) => [...prev, { sender: "user", text: input }]);
      setInput("");
      setIsStreaming(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      <ChatInterfaceNavbar />
      <div className="flex-grow-1 overflow-auto px-4 py-3 d-flex justify-content-center message-window">
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
                {msg.sender === "bot" ? (
                  <ReactMarkdown
                    children={msg.text}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  />
                ) : (
                  msg.text
                )}
              </span>
            </div>
          ))}

          {/* Typing indicator */}
          {isStreaming && (
            <div className="mb-2 text-start bot-typing">
              <span className="dot one">.</span>
              <span className="dot two">.</span>
              <span className="dot three">.</span>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>
      </div>

      <div
        className={`chat-input-container d-flex align-items-center justify-content-center p-1 flex-column gap-3 ${
          messages.length > 0 ? "field-bottom" : "field-center"
        }`}
      >
        {messages.length === 0 && <h4>Upload Logs and Start Analysing!</h4>}

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
              overflowY: "hidden",
              maxHeight: `${lineHeight * maxRows}px`,
              lineHeight: `${lineHeight}px`,
            }}
            autoFocus
          />
          <button
            className="chat-interface-input-send-button ms-1 mt-auto"
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
