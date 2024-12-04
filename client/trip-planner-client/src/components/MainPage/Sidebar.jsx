import React, { useState } from "react";
import "./Sidebar.css";
import Marker from "./Marker";
import CalculationForm from "./CalculationForm";
import MarkerForm from "./MarkerForm"; 

const Sidebar = ({ markers, onDelete, onMarkerClick, onEdit }) => {
  const [showCalculationForm, setShowCalculationForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); 
  const [markerName, setMarkerName] = useState("");
  const [markerTime, setMarkerTime] = useState(30);


  const handleCalculatePath = () => {
    setShowCalculationForm(true);
  };

  const handleCalculate = (maxHours, maxDays) => {
    console.log("Congratulations, you're going on the trip!");
  };

  
  const handleEditMarker = (index) => {
    setEditingIndex(index);
    setMarkerName(markers[index].name); 
    setMarkerTime(markers[index].time || 30);
  };

  const handleSaveMarker = (e) => {
    e.preventDefault();
    const updatedMarkers = [...markers]; 
    updatedMarkers[editingIndex] = { 
      ...updatedMarkers[editingIndex],
      name: markerName,
      time: markerTime,
    };
    setEditingIndex(null); 
    onEdit(updatedMarkers); 
  };

  return (
    <div className="sidebar">
      <h2>Localizations</h2>
      <div className="marker-list">
        <ul>
          {markers.map((marker, index) => (
            <Marker
              key={index}
              index={index}
              name={marker.name}
              onDelete={onDelete}
              isActive={index===0}
              onClick={() => onMarkerClick(marker.lat, marker.lng)}
              onEdit={() => handleEditMarker(index)} // Pass edit handler to the Marker component
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

      {editingIndex !== null && (
        <div className="edit-marker-form">
          <MarkerForm
            markerName={markerName}
            markerTime={markerTime}
            setMarkerName={setMarkerName}
            setMarkerTime={setMarkerTime}
            onSubmit={handleSaveMarker} 
            onCancel={() => setEditingIndex(null)} 
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
