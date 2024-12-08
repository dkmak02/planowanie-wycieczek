import React from "react";
import "./UploadJson.css";
import { useNavigate } from "react-router-dom";

const UploadJson = ({ onClose }) => {
  const navigate = useNavigate();

  const handleOutsideClick = (event) => {
    if (event.target.className.includes("upload-modal")) {
      onClose();
    }
  };

  const validateJsonContent = (jsonData) => {
    return (
      jsonData &&
      Array.isArray(jsonData.filteredData) && // Example: Check if `filteredData` is an array
      jsonData.filteredData.every(
        (item) =>
          typeof item.day === "string" &&
          Array.isArray(item.routes) &&
          item.routes.every(
            (route) =>
              typeof route.start === "string" &&
              typeof route.end === "string" &&
              Array.isArray(route.path)
          )
      )
    );
  };

  const uploadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (!validateJsonContent(jsonData)) {
            throw new Error("Invalid JSON content!");
          }
          navigate("/route-map", { state: { result: jsonData } });
        } catch (err) {
          alert(err.message || "Invalid JSON file!");
        }
      };
      reader.readAsText(file);
    }
    onClose();
  };

  return (
    <div className="upload-modal" onMouseDown={handleOutsideClick}>
      <div className="upload-form">
        <h2>Upload JSON File</h2>
        <input
          type="file"
          accept=".json"
          onChange={uploadFile}
          className="file-input"
        />
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default UploadJson;
