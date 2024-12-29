import React from "react";
import './../styles/RouteInfo.css'; 

const RouteInfo = ({ location, onDelete, onEdit }) => {

  const formatTime = (timeInMinutes) => {
    if (!timeInMinutes || isNaN(timeInMinutes)) return <span data-available="false">Not Available</span>;

    const hours = Math.floor(timeInMinutes / 60);
    const minutes = Math.round(timeInMinutes % 60);

    return hours > 0
      ? `${hours}h ${minutes > 0 ? `${minutes.toFixed(0)}m` : ""}`.trim()
      : `${minutes}m`;
  };

  const formattedTravelTime = location.aggTime ? formatTime(location.aggTime * 60) : <span data-available="false">Not Available</span>;

  return (
    <div className="route-info-container">
      <div className="route-name">
        <strong>{location.name || "Route Name"}</strong>
      </div>
      <div className="route-start">
        <span>Visit time: {formatTime(location.time)}</span>
        <span>Travel Time: {formattedTravelTime}</span>
      </div>
      <div className="route-actions">
        <button onClick={() => onEdit(location)} className="edit-button">Edit</button>
        <button onClick={() => onDelete(location)} className="delete-button">Delete</button>
      </div>
    </div>
  );
};

export default RouteInfo;
