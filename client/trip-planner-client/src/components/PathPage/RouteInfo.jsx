import React from "react";

const RouteInfo = ({ route }) => {
  return (
    <div className="route-info">
      <div className="route-name">
        <strong>{route.start || "Route Name"}</strong>
      </div>
      <div className="route-start">
        <span>{route.startPoint || "Start Point: Not Available"}</span>
      </div>
    </div>
  );
};

export default RouteInfo;
