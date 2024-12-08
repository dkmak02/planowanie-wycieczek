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
  const uploadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          navigate("/route-map", { state: { result:jsonData } });
        } catch (err) {
          alert("Invalid JSON file!");
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
