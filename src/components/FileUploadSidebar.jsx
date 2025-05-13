import React, { useRef, useState } from "react";
import FileUploadNavbar from "./FileUploadNavbar";
import JSZip from "jszip";
import "./ChatInterface.css";
import { Form } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";

const FileUploadSidebar = ({setIsFileUploaded}) => {
  const fileInputRef = useRef();
  const [uploadedZips, setUploadedZips] = useState([]);

const handleMultipleZipUpload = async (e) => {
  setUploadedZips([]);
  const files = Array.from(e.target.files);

  for (const file of files) {
    const isZip = file.name.endsWith(".zip");
    const isGz = file.name.endsWith(".gz");

    if (!isZip && !isGz) continue;

    // Upload file first
    const uploadSuccess = await uploadZipToServer(file);
    if (!uploadSuccess) {
      console.warn(`Skipping ZIP structure extraction due to failed upload: ${file.name}`);
      continue;
    }

    // Only after successful upload, parse the ZIP locally
    if (isZip) {
      try {
        const zip = await JSZip.loadAsync(file);
        const structure = [];

        Object.keys(zip.files).forEach((filename) => {
          const zipFile = zip.files[filename];
          const parts = filename.split("/");
          let current = structure;

          parts.forEach((part, i) => {
            if (!part) return;
            let existing = current.find((node) => node.name === part);
            if (!existing) {
              existing = {
                name: part,
                isFolder: i < parts.length - 1 || zipFile.dir,
                children: [],
              };
              current.push(existing);
            }
            current = existing.children;
          });
        });

        setUploadedZips((prev) => [...prev, { zipName: file.name, structure }]);
      } catch (e) {
        console.error(`Failed to parse ZIP file: ${file.name}`, e);
      }
    } else if (isGz) {
      setUploadedZips((prev) => [
        ...prev,
        { zipName: file.name, structure: [{ name: file.name, isFolder: false, children: [] }] },
      ]);
    }
  }
};

const uploadZipToServer = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    console.log("Upload response:", result);
    if (!res.ok) {
      alert(result.error || "Upload failed");
      return false;
    }
    alert("File Upload successful")
    setIsFileUploaded(true);
    return true;
  } catch (error) {
    console.error("Upload error:", error);
    alert("Upload failed");
    setIsFileUploaded(false);
    return false;
  }
};



  const preventDefault = (e) => e.preventDefault();
  return (
    <div>
      
      <div className="p-4">
        <div
          className="dotted-upload-box text-center"
          onDrop={handleMultipleZipUpload}
          onDragOver={preventDefault}
          onClick={() => fileInputRef.current.click()}
        >
          <FaUpload size={24} className="mb-2 upload-icon" />
          <p className="fs-12">
            Drag & Drop or{" "}
            <span className="choose-file-text">Choose Folder</span> to upload
          </p>

          <Form.Control
            type="file"
            accept=".zip"
            ref={fileInputRef}
            onChange={handleMultipleZipUpload}
            style={{ display: "none" }}
          />
        </div>
        <div>
          <p className="fs-14 mt-3">Uploaded Files</p>
          <ul className="list-unstyled">
            {uploadedZips.map((zip, idx) => (
              <div key={idx} className="mb-4">
                <h6>📦 {zip.zipName}</h6>
                {renderTree(zip.structure)}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const renderTree = (nodes) => (
  <ul className="list-unstyled ms-3">
    {nodes.map((node, idx) => (
      <li key={idx}>
        {node.isFolder ? "📁" : "📄"} {node.name}
        {node.children.length > 0 && renderTree(node.children)}
      </li>
    ))}
  </ul>
);

export default FileUploadSidebar;
