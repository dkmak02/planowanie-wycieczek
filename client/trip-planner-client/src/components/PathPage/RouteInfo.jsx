import React from "react";
import './RouteInfo.css'; // Import the new styles

const RouteInfo = ({ location }) => {
  return (
    <div>
      <div className="route-name">
        <strong>{location.name || "Route Name"}</strong>
      </div>
      <div className="route-start">
        <span>Time needed: {location.time || <span data-available="false">Start Point: Not Available</span>}</span>
        <span>Agg Time: {location.aggTime || <span data-available="false">End Point: Not Available</span>}</span>
      </div>
    </div>
  );
};

export default RouteInfo;
