import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import "./ChatInterface.css"

const ConfirmationModal = ({ show, onConfirm, onCancel, title, message }) => {
  return (
    <Modal show={show} onHide={onCancel} centered className='custom-modal'>
      <Modal.Header closeButton className='py-3'>
        <Modal.Title>{title || "Are you sure?"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='py-3'>
        <p className='mb-0'>{message || "This action cannot be undone."}</p>
      </Modal.Body>
      <Modal.Footer className='py-2'>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        
        <Button variant="danger" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
