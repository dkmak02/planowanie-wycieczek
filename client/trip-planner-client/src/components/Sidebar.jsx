import React from "react";
import "./Sidebar.css"; // Ensure this is the correct path to your CSS
import Marker from "./Marker"; // Import the Marker component

const Sidebar = ({ markers, onDelete, onMoveToTop }) => {
  return (
    <div className="sidebar">
      <h2>Markers</h2>
      <div className="marker-list">
        <ul>
          {markers.map((marker, index) => (
            <Marker
              key={index}
              index={index}
              name={marker.name}
              onDelete={onDelete}
              isActive={index === 0} // Set first marker as active for styling
            />
          ))}
        </ul>
      </div>
      {markers.length >= 2 && (
        <button
          onClick={() => console.log("Calculate Path")}
          className="calculate-button"
        >
          Calculate Path
        </button>
      )}
    </div>
  );
};

export default Sidebar;
