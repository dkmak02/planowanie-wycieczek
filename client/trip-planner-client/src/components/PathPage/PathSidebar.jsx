import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import './PathSidebar.css';  
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
    // Trigger the same function that toggles the checkbox state
    handleDayToggle(day);

    // Toggle the strikethrough (clickedDays)
    setClickedDays((prev) => ({
      ...prev,
      [day]: !prev[day], // Toggle the cut effect
    }));
  };
  return (
    <div className="sidebar">
      <h3>Days</h3>
      {routesData.map(({ day, locations }, dayIndex) => (
        <div key={`sidebar-${dayIndex}`} className="day-section">
          <h4 className="day-header">
            <input
              type="checkbox"
              checked={selectedDays[day] || false}  
              onChange={() => handleClickDay(day)} 
            />
            {/* Make the day text clickable */}
            <span 
              onClick={() => handleClickDay(day)}  // Toggling checkbox and cut effect
              className={clickedDays[day] ? "cut" : ""}
            >
              {day}
            </span>
          </h4>
          <div className="day-routes">
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

  useEffect(() => {
    if (isDragging) {
      const sidebar = document.querySelector('.sidebar');
      const scrollSpeed = 10; // Speed at which the sidebar will scroll when near edges

      const handleScroll = (e) => {
        const rect = sidebar.getBoundingClientRect();
        const scrollPosition = sidebar.scrollTop;

        // Get the distance from the cursor to the top and bottom of the sidebar
        const distanceFromTop = e.clientY - rect.top;
        const distanceFromBottom = rect.bottom - e.clientY;

        // If cursor is near top, scroll up
        if (distanceFromTop < 50 && scrollPosition > 0) {
          sidebar.scrollBy(0, -scrollSpeed);
        }
        // If cursor is near bottom, scroll down
        else if (distanceFromBottom < 50 && sidebar.scrollHeight - sidebar.scrollTop > sidebar.clientHeight) {
          sidebar.scrollBy(0, scrollSpeed);
        }
      };

      // Attach the mousemove event to document to track mouse position
      document.addEventListener('mousemove', handleScroll);

      // Clean up event listener when dragging ends
      return () => {
        document.removeEventListener('mousemove', handleScroll);
      };
    }
  }, [isDragging]);

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
