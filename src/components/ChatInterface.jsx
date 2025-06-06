import React, { useEffect, useRef, useState } from "react";
import { FormControl, InputGroup } from "react-bootstrap";
import { FaArrowUp } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "./ChatInterface.css";
import ChatInterfaceNavbar from "./ChatInterfaceNavbar";
import { toast } from "react-toastify";

const ChatInterface = ({ isFileUploaded }) => {
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
      console.log("Received token:", JSON.stringify(token));
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
          const updatedMessages = prevMessages.map((msg, index) => {
            if (index === prevMessages.length - 1) {
              return { ...msg, text: msg.text + token };
            }
            return msg;
          });
          return updatedMessages;
        } else {
          return [...prevMessages, { sender: "bot", text: token }];
        }
      });
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
    if (!isFileUploaded) {
      toast.error("Upload Log files before Proceeding");
      return;
    }
    if (input.trim()) {
      socket.current.send(input);
      setMessages((prev) => [...prev, { sender: "user", text: input }]);
      setInput("");
      setIsStreaming(true);
    }
  };

  const handleKeyDown = (e) => {
    if (isStreaming) return; //  Prevent sending during streaming

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="d-flex flex-column vh-100 ">
      <ChatInterfaceNavbar />
      <div className="flex-grow-1 overflow-auto px-4 py-3 d-flex justify-content-center message-window">
        <div className="message-window-container w-100 d-flex flex-column">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-1 fs-14 d-flex justify-content-${
                msg.sender === "user" ? "end" : "start"
              }`}
            >
              <div
                className={`chat-window-text ${
                  msg.sender === "user" ? "user-text" : "bot-text text-justify"
                }`}
              >
                {msg.sender === "bot" ? (
                  <ReactMarkdown
                    children={msg.text}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      table: (props) => (
                        <div className="fancy-table-wrapper">
                          <table className="fancy-markdown-table" {...props} />
                        </div>
                      ),
                      th: (props) => (
                        <th className="fancy-markdown-th" {...props} />
                      ),
                      td: (props) => (
                        <td className="fancy-markdown-td" {...props} />
                      ),
                    }}
                  />
                ) : (
                  msg.text
                )}
              </div>
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
        {messages.length === 0 && <h4>Upload Logs to Start Analysing!</h4>}

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
            disabled={isStreaming}
          >
            {isStreaming ? (
              <div className="mb-2 text-start button-loading">
                <span className="dot one">.</span>
                <span className="dot two">.</span>
                <span className="dot three">.</span>
              </div>
            ) : (
              <FaArrowUp />
            )}
          </button>
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatInterface;
