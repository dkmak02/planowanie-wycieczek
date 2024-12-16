import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import './../styles/PathSidebar.css';  
import RouteInfo from "./RouteInfo";

const PathSidebar = ({ routesData, moveRoute, setVisibleRoutes, visibleRoutes }) => {
  const [selectedDays, setSelectedDays] = useState({});
  const [clickedDays, setClickedDays] = useState({});

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

  // Function to calculate total time for a day
  const calculateTotalTime = (locations) => {
    return locations.reduce((total, location) => {
      const locationTime = location.time || 0; // `time` in minutes
      const aggTime = (location.aggTime || 0) * 60; // Convert `aggTime` (in hours) to minutes
      return total + locationTime + aggTime;
    }, 0);
  };

  // Function to format total time in hours and minutes
  const formatTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes.toFixed(0)}m` : ""}`.trim();
    } else {
      return `${minutes}m`;
    }
  };

  return (
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
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

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
      <RouteInfo location={location} />
    </div>
  );
};

export default PathSidebar;
