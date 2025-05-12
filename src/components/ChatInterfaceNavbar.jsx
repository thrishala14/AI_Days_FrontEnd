import React from "react";
import { Navbar } from "react-bootstrap";
import "./ChatInterface.css"

const ChatInterfaceNavbar = () => {
  return (
    <Navbar className=" chat-interface-navbar px-3 sticky-top ">
      <Navbar.Brand>Insight Trace</Navbar.Brand>
    </Navbar>
  );
};

export default ChatInterfaceNavbar;
