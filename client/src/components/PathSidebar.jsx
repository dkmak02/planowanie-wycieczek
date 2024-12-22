import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import './../styles/PathSidebar.css';  
import RouteInfo from "./RouteInfo";
import { useMarkers } from "../context/MarkerContext";
import MarkerForm from "./MarkerForm";

const PathSidebar = ({ routesData, moveRoute, setRoutesData, setVisibleRoutes, visibleRoutes, fixRoutesAfterDelete }) => {
  const [selectedDays, setSelectedDays] = useState({});
  const [clickedDays, setClickedDays] = useState({});
  const { markers, setMarkers, setAllData, allData } = useMarkers();
  const [isEditing, setIsEditing] = useState(false);
  const [markerName, setMarkerName] = useState("");
  const [markerTime, setMarkerTime] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const defaultSelectedDays = {};
    routesData.forEach(({ day }) => {
      if (visibleRoutes[day] !== undefined) {
        defaultSelectedDays[day] = visibleRoutes[day];
      } else {
        defaultSelectedDays[day] = true;
      }
    });
    setSelectedDays(defaultSelectedDays);
  }, [routesData]);

  useEffect(() => {
    setVisibleRoutes(selectedDays);
  }, [selectedDays, setVisibleRoutes]);

  const handleDayToggle = (day) => {
    setSelectedDays((prevState) => {
      const updatedState = { ...prevState, [day]: !prevState[day] };
      return updatedState;
    });
  };

  const handleClickDay = (day) => {
    handleDayToggle(day);

    setClickedDays((prev) => ({
      ...prev,
      [day]: !prev[day], // Toggle the cut effect
    }));
  };

  const handleDelete = (location) => {
    const dayIndex = routesData.findIndex((route) => 
    route.locations.some((loc) => loc.name === location.name));
    const updatedMarkers = markers.filter((marker) => marker.name !== location.name);
    const updadedAllData = allData.filter((marker) => marker.start !== location.name && marker.end !== location.name);
    setAllData(updadedAllData);
    setMarkers(updatedMarkers);
    fixRoutesAfterDelete(dayIndex, location);
  };

  const handleEdit = (location) => {
    setEditingIndex(markers.findIndex((marker) => marker.name === location.name));
    setMarkerName(location.name);
    setMarkerTime(location.time || 0);
    setIsEditing(true);
  };

  const calculateTotalTime = (locations) => {
    return locations.reduce((total, location) => {
      const locationTime = location.time || 0; // `time` in minutes
      const aggTime = (location.aggTime || 0) * 60; // Convert `aggTime` (in hours) to minutes
      return total + locationTime + aggTime;
    }, 0);
  };

  const formatTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0
      ? `${hours}h ${minutes > 0 ? `${minutes.toFixed(0)}m` : ""}`.trim()
      : `${minutes.toFixed(0)}m`;
  };
  const handleFormCancel = () => {
    setIsEditing(false);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (
      markers.some(
        (marker, idx) =>
          marker.name.toLowerCase() === markerName.toLowerCase()  && idx !== editingIndex
      )
    ) {
      alert("Marker name must be unique. Please choose a different name.");
      return;
    }
    const updatedMarkers = [...markers];
    updatedMarkers[editingIndex] = {
      ...updatedMarkers[editingIndex],
      name: markerName,
      time: markerTime,
    };
    setMarkers(updatedMarkers);
    setIsEditing(false);
  };
  return (
    <div>
    {isEditing && (
  <MarkerForm
    markerName={markerName}
    markerTime={markerTime}
    setMarkerName={setMarkerName}
    setMarkerTime={setMarkerTime}
    onSubmit={handleFormSubmit}
    onCancel={handleFormCancel}
    disableNameChange={true} 
  />
)}

    <div className="sidebar">
      <h3>Days</h3>
      {routesData.map(({ day, locations }, dayIndex) => {
        const totalTime = calculateTotalTime(locations); // Calculate total time for the day
        return (
          <div key={`sidebar-${dayIndex}`} className="day-section">
            <h4 className="day-header">
              <input
                type="checkbox"
                checked={selectedDays[day] || false}
                onChange={() => handleClickDay(day)}
              />
              <span
                onClick={() => handleClickDay(day)}
                className={clickedDays[day] ? "cut" : ""}
              >
                {day} - Total Time: {formatTime(totalTime)}
              </span>
            </h4>
            <div className="day-routes">
              {(Array.isArray(locations) ? locations : []).map((location, locationIndex) => (
                <DraggableRoute
                  key={`location-${locationIndex}`}
                  day={day}
                  location={location}
                  locationIndex={locationIndex}
                  moveRoute={moveRoute}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
};

const DraggableRoute = ({ day, location, locationIndex, moveRoute, onDelete, onEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "route",
    item: { day, locationIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "route",
    drop: (item) => {
      moveRoute(item.day, item.locationIndex, day, locationIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`route-item ${isDragging ? "dragging" : ""} ${isOver ? "over" : ""}`}
    >
      <RouteInfo 
        location={location} 
        onDelete={() => onDelete(location)} 
        onEdit={() => onEdit(location)} 
      />
    </div>
  );
};

export default PathSidebar;
