import React, { useEffect, useState } from "react";
import ChatInterface from "./components/ChatInterface";
import { Button, Navbar, Container, Row, Col } from "react-bootstrap";
import "./App.css";
import FileUploadSidebar from "./components/FileUploadSidebar";

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  });

  return (
    <>
      <div className=" vh-100 overflow-hidden">
        <Row className="h-100">
          <Col md={3} className={`border-end p-0 file-upload-container`}>
            <FileUploadSidebar />
          </Col>
          <Col className="d-flex flex-column position-relative p-0 chat-container ">
            <ChatInterface />
          </Col>
        </Row>
      </div>
    </>
  );
}
