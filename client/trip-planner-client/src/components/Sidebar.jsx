import React from 'react';
import './Sidebar.css'; // Ensure this is the correct path to your CSS

const Sidebar = ({ markers, onDelete, onMoveToTop, onCalculatePath }) => {
  return (
    <div className="sidebar">
      <h2>Markers</h2>
      <div className="marker-list">
        <ul>
          {markers.map((marker, index) => (
            <li
              key={index}
              className={index === 0 ? "marker-highlight" : ""} // Highlight the first marker
              onClick={() => onMoveToTop(index)} // Move to top on click
            >
              Place: {marker.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(index);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      {markers.length >= 2 && (
        <button onClick={onCalculatePath} className="calculate-button">
          Calculate Path
        </button>
      )}
    </div>
  );
};

export default Sidebar;
