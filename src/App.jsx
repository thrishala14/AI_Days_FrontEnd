import React, { useEffect, useState } from "react";
import ChatInterface from "./components/ChatInterface";
import { Button, Navbar, Container, Row, Col } from "react-bootstrap";
import "./App.css";
import FileUploadSidebar from "./components/FileUploadSidebar";
import FileUploadNavbar from "./components/FileUploadNavbar";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [sidebarWidth, setSidebarWidth] = useState("300px");
  const [isFileUploaded, setIsFileUploaded] = useState(false)

  const handleMouseDown = (e) => {
    const startX = e.clientX;

    const handleMouseMove = (e) => {
      const newWidth = e.clientX;
      const minWidth = 200; // px
      const maxWidth = 500; // optional

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(`${newWidth}px`);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    document.body.className = theme;
  });

  return (
    <>
      <div className="d-flex vh-100 overflow-hidden">
        <div
          className="file-upload-container border-end"
          style={{ width: sidebarWidth }}
        >
         <div className="file-upload-sidebar">
           <FileUploadNavbar />
          <FileUploadSidebar setIsFileUploaded={setIsFileUploaded}/>
         </div>
        </div>

        {/* Drag handle */}
        <div className="resize-handle" onMouseDown={handleMouseDown} />

        <div className="chat-container flex-grow-1 d-flex flex-column position-relative p-0">
          <ChatInterface isFileUploaded={isFileUploaded}/>
        </div>
      </div>
    </>
  );
}
