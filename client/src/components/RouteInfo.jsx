import React from "react";
import './../styles/RouteInfo.css'; // Import the new styles

const RouteInfo = ({ location }) => {
  // Utility function to format time in minutes to hours and minutes
  const formatTime = (timeInMinutes) => {
    if (!timeInMinutes || isNaN(timeInMinutes)) return <span data-available="false">Not Available</span>;

    const hours = Math.floor(timeInMinutes / 60);
    const minutes = Math.round(timeInMinutes % 60);

    return hours > 0
      ? `${hours}h ${minutes > 0 ? `${minutes.toFixed(0)}m` : ""}`.trim()
      : `${minutes}m`;
  };

  // Convert aggTime from hours to minutes for formatting
  const formattedTravelTime = location.aggTime ? formatTime(location.aggTime * 60) : <span data-available="false">Not Available</span>;

  return (
    <div>
      <div className="route-name">
        <strong>{location.name || "Route Name"}</strong>
      </div>
      <div className="route-start">
        <span>Visit time: {formatTime(location.time)}</span>
        <span>Travel Time: {formattedTravelTime}</span>
      </div>
    </div>
  );
};

export default RouteInfo;
