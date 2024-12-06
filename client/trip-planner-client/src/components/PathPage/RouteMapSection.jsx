import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend"; 
import PathSidebar from "./PathSidebar";
import "leaflet/dist/leaflet.css";
import "./RouteMapSection.css";

const firstMarkerIcon = L.icon({
  iconUrl: "/map_starter_marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const dayColors = {
  day1: "blue",
  day2: "green",
  day3: "red",
  day4: "purple",
  day5: "orange",
};

const RouteMapSection = () => {
  const [routesData, setRoutesData] = useState({});
  const [pointsData, setPointsData] = useState({});
  const [visibleRoutes, setVisibleRoutes] = useState({});
  useEffect(() => {
    const fetchRoutesData = async () => {
      try {
        const response = await fetch("/output.json");
        if (!response.ok) {
          throw new Error("Failed to fetch JSON data");
        }
        const data = await response.json();
        console.log(data);
        setRoutesData(data.data.filteredData);  
        setPointsData(data.data.locations); 
      } catch (error) {
        console.error("Error fetching routes data:", error);
      }
    };

    fetchRoutesData();
  }, []);

  const moveRoute = (draggedDay, draggedRouteIndex, droppedDay, droppedRouteIndex) => {
    const updatedRoutesData = { ...routesData };

    const draggedRoute = updatedRoutesData[draggedDay][draggedRouteIndex];
    updatedRoutesData[draggedDay].splice(draggedRouteIndex, 1);

    updatedRoutesData[droppedDay].splice(droppedRouteIndex, 0, draggedRoute);

    setRoutesData(updatedRoutesData);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="map-container">
        <MapContainer
          center={[50.0539, 19.8976]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {Object.entries(routesData).map(([day, routes], dayIndex) => (
            routes.length > 0 && visibleRoutes[day] !== false && (
              <div key={`day-${dayIndex}`}>
                <h4>{day}</h4>
                {routes.map((route, routeIndex) => {
                  return route.path && route.path.length > 0
                    ? route.path.map((segment, segmentIndex) => {
                        if (
                          segment.geoJSON &&
                          segment.geoJSON.coordinates &&
                          segment.geoJSON.coordinates.length > 0
                        ) {
                          const coordinates = segment.geoJSON.coordinates.map(
                            ([lon, lat]) => [lat, lon]
                          );

                          const pathColor = dayColors[day] || "gray";

                          return (
                            <Polyline
                              key={`route-${dayIndex}-route-${routeIndex}-segment-${segmentIndex}`}
                              positions={coordinates}
                              color={pathColor}  
                              weight={4}
                            />
                          );
                        }
                        return null;
                      })
                    : null;
                })}
              </div>
            )
          ))}

          {Object.entries(pointsData).map(([pointName, coords]) => (
            <Marker key={pointName} position={coords} icon={firstMarkerIcon}>
              <Popup>{pointName}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <PathSidebar routesData={routesData} moveRoute={moveRoute} setVisibleRoutes={setVisibleRoutes} />
    </DndProvider>
  );
};

export default RouteMapSection;
