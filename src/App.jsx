import React, { useEffect, useState } from 'react';
import ChatInterface from './components/ChatInterface';
import { Button, Navbar, Container, Row, Col } from 'react-bootstrap';
import './App.css'
import FileUploadSidebar from './components/FileUploadSidebar';

export default function App() {

  const [theme, setTheme] = useState("light");
 
    // Set initial theme based on system or saved preference
    useEffect(() => {
      // const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
  
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.body.className = initialTheme;
    }, []);

    // Toggle theme
  const handleToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme;
    // localStorage.setItem("theme", newTheme);
  };

  return (
    <>
   <div className="light vh-100 overflow-hidden">
  <Row className="h-100">
    <Col md={3} className="border-end p-0">
      <FileUploadSidebar />
    </Col>
   <Col md={9} className="d-flex flex-column position-relative p-0">
  <ChatInterface />
</Col>
  </Row>
</div>
    </>
  );
}
