import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedMarkers = Array.from(markers);
    const [movedMarker] = reorderedMarkers.splice(result.source.index, 1);
    reorderedMarkers.splice(result.destination.index, 0, movedMarker);

    onEdit(reorderedMarkers);
  };

  return (
    <div className="sidebar">
      <h2>Localizations</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="marker-list">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="marker-list"
            >
              {markers.map((marker, index) => (
                <Draggable key={index} draggableId={`marker-${index}`} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}      

                    >
                      <Marker
                        key={index}
                        index={index}
                        name={marker.name}
                        onDelete={onDelete}
                        isActive={index === 0}
                        onClick={() => onMarkerClick(marker.lat, marker.lng)}
                        onEdit={() => handleEditMarker(index)}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>

      </DragDropContext>
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
