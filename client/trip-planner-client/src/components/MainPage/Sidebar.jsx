import React, { useState } from "react";
import "./Sidebar.css";
import Marker from "./Marker";
import CalculationForm from "./CalculationForm";
const Sidebar = ({ markers, onDelete, onMarkerClick }) => {
  const [showCalculationForm, setShowCalculationForm] = useState(false);
  const handleCalculatePath = () => {
    setShowCalculationForm(true);
  };

  const handleCalculate = (maxHours, maxDays) => {
    if (markers.every((marker) => marker.isRestingPlace === false)) {
      console.log("Please select at least one resting place");
      return;
    }
    console.log("gratulacje jedziesz na wyceiczke");

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
              isActive={marker.isRestingPlace}
              onClick={() => onMarkerClick(marker.lat, marker.lng)}
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
        <CalculationForm
          onCalculate={handleCalculate}
          onClose={() => setShowCalculationForm(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
