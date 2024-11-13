// Marker.js
import React from "react";
import "./Marker.css";

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
              e.stopPropagation();
              onDelete(index);
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
