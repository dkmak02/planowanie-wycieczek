// Marker.js
import React from "react";
import "./Marker.css"; // Ensure this file exists for styling

const Marker = ({ index, name, onDelete, isActive, onClick }) => {
  return (
    <li
      className={`marker ${isActive ? "marker-active" : ""}`}
      onClick={onClick}
    >
      <div className="marker-content">
        <span className="marker-text">{name}</span>
        <div className="marker-actions">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering any parent click events
              onDelete(index); // Call the delete function
            }}
            className="delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default Marker;
