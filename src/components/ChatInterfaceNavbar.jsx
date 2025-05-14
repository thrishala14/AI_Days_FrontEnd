import React, { useEffect, useState } from "react";
import { Form, Navbar } from "react-bootstrap";
import "./ChatInterface.css";
import { FaMoon, FaSun } from "react-icons/fa";

const ChatInterfaceNavbar = () => {
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
  };
  return (
    <Navbar className="chat-interface-navbar px-3 sticky-top">
 <Navbar.Brand>
  <img 
    src="../../src/assets/InsightTrace.png" 
    alt="InsightTrace Logo" 
    height={36}
  />
  <strong className={theme === "dark" ? "text-white" : "text-darkblue"}>
    Insight
  </strong>
  <strong className="text-orange">Trace</strong>
</Navbar.Brand>

  <div className="ms-auto d-flex align-items-center">
     <div className="theme-toggle-wrapper" onClick={handleToggle}>
      <div className={`toggle-switch ${document.body.className === "dark" ? "dark" : "light"}`}>
         <div className="toggle-knob" >
          {document.body.className === "light" ? <FaMoon /> : <FaSun />}
         </div>
        <div className="toggle-icon">
          {document.body.className === "dark" ? <FaMoon /> : <FaSun />}
        </div>
      </div>
    </div>
  </div>
</Navbar>

  );
};

export default ChatInterfaceNavbar;
