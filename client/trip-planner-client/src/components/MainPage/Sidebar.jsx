import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import "./Sidebar.css";
import MarkerForm from "./MarkerForm";
import CalculationForm from "./CalculationForm";
import Marker from "./Marker";

const ItemType = "MARKER"; 

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

  const handleDragEnd = (fromIndex, toIndex) => {
    const reorderedMarkers = [...markers];
    const movedMarker = reorderedMarkers.splice(fromIndex, 1)[0];
    reorderedMarkers.splice(toIndex, 0, movedMarker);
    onEdit(reorderedMarkers);
  };

  const MarkerWithDragDrop = ({ index, marker }) => {
    const [, drag] = useDrag({
      type: ItemType,
      item: { index },
    });

    const [, drop] = useDrop({
      accept: ItemType,
      hover: (item) => {
        if (item.index !== index) {
          handleDragEnd(item.index, index);
          item.index = index;
        }
      },
    });

    return (
      <li ref={(node) => drag(drop(node))}>
        <Marker
          index={index}
          name={marker.name}
          onDelete={onDelete}
          isActive={index === 0}
          onClick={() => onMarkerClick(marker.lat, marker.lng)}
          onEdit={() => handleEditMarker(index)}
        />
      </li>
    );
  };

  return (
    <div className="sidebar">
      <h2>Localizations</h2>
      <div className="marker-list">
        <ul>
          {markers.map((marker, index) => (
            <MarkerWithDragDrop
              key={index}
              index={index}
              marker={marker}
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
