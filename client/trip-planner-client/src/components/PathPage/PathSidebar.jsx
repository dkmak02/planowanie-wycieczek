import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import './PathSidebar.css';  
import RouteInfo from "./RouteInfo";

const PathSidebar = ({ routesData, moveRoute, setVisibleRoutes, visibleRoutes}) => {
  const [selectedDays, setSelectedDays] = useState({});
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

  return (
    <div className="sidebar">
      <h3>Days</h3>
      {routesData.map(({ day, locations }, dayIndex) => (
        <div key={`sidebar-${dayIndex}`} className="day-section">
          <h4>
            <input
              type="checkbox"
              checked={selectedDays[day] || false}  // Keep the state persistent here
              onChange={() => handleDayToggle(day)} // Update only when the checkbox is clicked
            />
            {day}
          </h4>
          <div
            className="day-routes"
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {(Array.isArray(locations) ? locations : [])
              .map((location, locationIndex) => (
                <DraggableRoute
                  key={`location-${locationIndex}`}
                  day={day}
                  location={location}
                  locationIndex={locationIndex}
                  moveRoute={moveRoute}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// DraggableRoute component with drag-and-drop functionality
const DraggableRoute = ({ day, location, locationIndex, moveRoute }) => {
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
      // Preserve the selectedDays state during drag-and-drop operation
      if (item.day === day) {
        moveRoute(item.day, item.locationIndex, day, locationIndex);
      } else {
        moveRoute(item.day, item.locationIndex, day, locationIndex);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`route-item ${isDragging ? "dragging" : ""} ${isOver ? "over" : ""}`}
      style={{
        padding: "8px",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        cursor: "move",
      }}
    >
      <RouteInfo location={location} />
    </div>
  );
};

export default PathSidebar;
