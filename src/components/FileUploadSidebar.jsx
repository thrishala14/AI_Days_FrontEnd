import React, { useRef, useState } from "react";
import FileUploadNavbar from "./FileUploadNavbar";
import JSZip from "jszip";
import "./ChatInterface.css";
import { Form } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";
import LogProcessingModal from "./LogProcessingModal";

const FileUploadSidebar = ({ setIsFileUploaded, isFileUploaded }) => {
  const fileInputRef = useRef();
  const [uploadedZips, setUploadedZips] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    console.log("isFileUploaded", isFileUploaded);

    if (isFileUploaded) {
      // Ask for confirmation before replacing uploaded content
      setPendingFiles(files);
      setShowConfirmationModal(true);
    } else {
      // Just upload directly
      handleMultipleZipUpload(files);
    }
  };

  const confirmUpload = () => {
    handleMultipleZipUpload(pendingFiles);
    setPendingFiles([]);
    setShowConfirmationModal(false);
  };

  const handleMultipleZipUpload = async (files) => {
    setUploadedZips([]);
    // const files = Array.from(e.target.files);

    for (const file of files) {
      const isZip = file.name.endsWith(".zip");
      const isGz = file.name.endsWith(".gz");

      if (!isZip && !isGz) continue;

      // Upload file first
      const uploadSuccess = await uploadZipToServer(file);
      if (!uploadSuccess) {
        console.warn(
          `Skipping ZIP structure extraction due to failed upload: ${file.name}`
        );
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

          setUploadedZips((prev) => [
            ...prev,
            { zipName: file.name, structure },
          ]);
        } catch (e) {
          console.error(`Failed to parse ZIP file: ${file.name}`, e);
        }
      } else if (isGz) {
        setUploadedZips((prev) => [
          ...prev,
          {
            zipName: file.name,
            structure: [{ name: file.name, isFolder: false, children: [] }],
          },
        ]);
      }
    }
  };

  const uploadZipToServer = async (file) => {
    setLoading(true)
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
        toast.error(result.error || "Upload failed");
        setIsFileUploaded(false);
        setLoading(false)
        return false;
      }
      toast.success("File Upload successful");
      setIsFileUploaded(true);
      setLoading(false)
      return true;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed because of " + error);
      setIsFileUploaded(false);
      setLoading(false)
      return false;
    }
  };

  const preventDefault = (e) => e.preventDefault();


  return (
    <div>
      <LogProcessingModal show={loading} />
      <div className="p-4">
        <div
          className="dotted-upload-box text-center"
          onDrop={handleFileInput}
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
            onChange={handleFileInput}
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
      <ConfirmationModal
        show={showConfirmationModal}
        onConfirm={confirmUpload}
        onCancel={() => setShowConfirmationModal(false)}
        title="Replace Logs?"
        message="Old Log Data will be lost"
      />
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
