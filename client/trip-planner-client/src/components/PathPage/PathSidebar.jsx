import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import './PathSidebar.css';  
import RouteInfo from "./RouteInfo";

const PathSidebar = ({ routesData, moveRoute, setVisibleRoutes }) => {
  const [selectedDays, setSelectedDays] = useState({});

  // Set default visibility for all days to true
  useEffect(() => {
    const defaultSelectedDays = {};
    Object.keys(routesData).forEach((day) => {
      defaultSelectedDays[day] = true; // Default to true (checked)
    });
    setSelectedDays(defaultSelectedDays);
  }, [routesData]);

  // Update the visibleRoutes state when selectedDays changes
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
      {Object.entries(routesData).map(([day, routes], dayIndex) => (
        <div key={`sidebar-${dayIndex}`} className="day-section">
          <h4>
            <input
              type="checkbox"
              checked={selectedDays[day] || false}  // Set default to true (checked)
              onChange={() => handleDayToggle(day)}
            />
            {day}
          </h4>
          <div
            className="day-routes"
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {routes.map((route, routeIndex) => (
              <DraggableRoute
                key={`route-${routeIndex}`}
                day={day}
                route={route}
                routeIndex={routeIndex}
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
const DraggableRoute = ({ day, route, routeIndex, moveRoute }) => {
  // Define the drag behavior using react-dnd
  const [{ isDragging }, drag] = useDrag({
    type: "route",
    item: { day, routeIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Define the drop behavior using react-dnd
  const [{ isOver }, drop] = useDrop({
    accept: "route",
    drop: (item) => {
      // Handle moving routes within the same day or across different days
      if (item.day === day) {
        // Move within the same day
        moveRoute(item.day, item.routeIndex, day, routeIndex);
      } else {
        // Move between different days
        moveRoute(item.day, item.routeIndex, day, routeIndex);
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
      {/* Display Route Info */}
      <RouteInfo route={route} />
    </div>
  );
};

export default PathSidebar;
