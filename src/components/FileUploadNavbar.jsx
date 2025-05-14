import React from 'react'
import { Navbar } from 'react-bootstrap'

const FileUploadNavbar = () => {
  return (
    <Navbar className="file-upload-navbar px-3 ps-4 sticky-top fw-semibold ">
      <Navbar.Brand className='fs-5 mt-2'>Logs Upload</Navbar.Brand>
    </Navbar>
  )
}

export default FileUploadNavbar