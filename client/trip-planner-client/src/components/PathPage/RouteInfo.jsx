import React from "react";

const RouteInfo = ({ location }) => {
  return (
    <div className="route-info">
      <div className="route-name">
        <strong>{location.name || "Route Name"}</strong>
      </div>
      <div className="route-start">
        <span>Time needed: {location.time || "Start Point: Not Available"}</span>
      </div>
    </div>
  );
};

export default RouteInfo;
