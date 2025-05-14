import React from "react";
import { Modal } from "react-bootstrap";
import { FaHourglassHalf } from "react-icons/fa";
import "./ChatInterface.css";

const LogProcessingModal = ({ show }) => {
  return (
    <Modal show={show} centered backdrop="static" keyboard={false} className="custom-modal" >
      <Modal.Body className="text-center py-4">
        <div className="hourglass-icon">
          <FaHourglassHalf size={20} />
        </div>
        <div className="mt-3 "><small className="opacity-75">Going through your logs...</small></div>
      </Modal.Body>
    </Modal>
  );
};

export default LogProcessingModal;
