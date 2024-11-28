import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./RouteMapSection.css";

const firstMarkerIcon = L.icon({
  iconUrl: "/map_starter_marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const RouteMapSection = () => {
  const [routesData, setRoutesData] = useState([]);
  const [pointsData, setPointsData] = useState({});

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

  return (
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
        {routesData.map((route, routeIndex) => {
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

                  return (
                    <Polyline
                      key={`route-${routeIndex}-segment-${segmentIndex}`}
                      positions={coordinates}
                      color="blue"
                      weight={4}
                    />
                  );
                }
                return null;
              })
            : null;
        })}
        {Object.entries(pointsData).map(([pointName, coords]) => (
          <Marker key={pointName} position={coords} icon={firstMarkerIcon}>
            <Popup>{pointName}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RouteMapSection;
