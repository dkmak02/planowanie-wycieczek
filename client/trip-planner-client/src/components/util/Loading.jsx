// Loading.jsx
import React from "react";
import "./Loading.css"; // Optional for styling

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
