import React, { useState } from "react";
import "./Sidebar.css";
import Marker from "./Marker";
import CalculationForm from "./CalculationForm";
const Sidebar = ({ markers, onDelete }) => {
  const [showCalculationForm, setShowCalculationForm] = useState(false);
  const handleCalculatePath = () => {
    setShowCalculationForm(true); // Show the calculation form
  };

  const handleCalculate = (maxHours, maxDays) => {
    console.log(
      "Calculating with:",
      maxHours,
      "hours/day and",
      maxDays,
      "days"
    );
    // Add your calculation logic here
  };
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
              isActive={index === 0}
              // onClick={() => onMarkerClick(index)}
            />
          ))}
        </ul>
      </div>
      {markers.length >= 2 && (
        <button onClick={handleCalculatePath} className="calculate-button">
          Calculate Path
        </button>
      )}
      {showCalculationForm && (
        <div className="form-overlay">
          {" "}
          {/* New overlay div */}
          <CalculationForm
            onCalculate={handleCalculate}
            onClose={() => setShowCalculationForm(false)} // Close the form
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
