import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MapSection from "./MapSection"; // Import the MapSection component

const ParentComponent = () => {
  const [markers, setMarkers] = useState([
    { name: "Kraków", lat: 50.0647, lng: 19.945, isRestingPlace: false },
    { name: "Warsaw", lat: 52.2298, lng: 21.0118, isRestingPlace: true },
    { name: "Gdańsk", lat: 54.352, lng: 18.646, isRestingPlace: false },
  ]);

  const handleUpdateMarkers = (updatedMarkers) => {
    setMarkers(updatedMarkers);
  };

  const handleDeleteMarker = (index) => {
    const updatedMarkers = markers.filter((_, i) => i !== index);
    setMarkers(updatedMarkers);
  };

  const handleMarkerClick = (lat, lng) => {
    // Handle marker click (e.g., zoom in on the map)
  };

  return (
    <div>
      <Sidebar
        markers={markers}
        onDelete={handleDeleteMarker}
        onMarkerClick={handleMarkerClick}
        onUpdateMarkers={handleUpdateMarkers}
      />
      <MapSection markers={markers} /> {/* Pass markers to MapSection */}
    </div>
  );
};

export default ParentComponent;
