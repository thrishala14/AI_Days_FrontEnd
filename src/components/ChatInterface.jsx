import React from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { FaArrowUp } from "react-icons/fa";
import './ChatInterface.css'
import ChatInterfaceNavbar from "./ChatInterfaceNavbar";


const ChatInterface = () => {
  return (
    <>
    <ChatInterfaceNavbar/>
      <div className="chat-input-container d-flex justify-content-center p-1" >
      <InputGroup className="chat-interface-input-group">
        <FormControl
          placeholder="Enter something..."
          className="chat-interface-input-text"
        />
        <button className="chat-interface-input-send-button">
          <FaArrowUp />
        </button>
      </InputGroup>
    </div>
    </>
  );
};

export default ChatInterface;
