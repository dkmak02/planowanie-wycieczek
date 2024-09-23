import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Sidebar from './Sidebar'; // Adjust the import path as necessary

const customIcon = L.icon({
  iconUrl: '/map_location_marker.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const firstMarkerIcon = L.icon({
  iconUrl: '/map_starter_marker.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const MapSection = () => {
  const [markers, setMarkers] = useState([]);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setLoading(false);
        },
        (error) => {
          console.error("Error retrieving location:", error);
          setPosition([51.505, -0.09]); // Default position
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        setMarkers((prevMarkers) => [...prevMarkers, { lat, lng }]);
        console.log("Marker added at:", lat, lng);
      },
    });
    return null;
  };

  const handleDeleteMarker = (index) => {
    setMarkers((prevMarkers) => prevMarkers.filter((_, i) => i !== index));
  };

  const handleMoveToTop = (index) => {
    setMarkers((prevMarkers) => {
      const newMarkers = [...prevMarkers];
      const [movedMarker] = newMarkers.splice(index, 1);
      newMarkers.unshift(movedMarker);
      return newMarkers;
    });
  };

  if (loading) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="content">
      <Sidebar 
        markers={markers} 
        onDelete={handleDeleteMarker} 
        onMoveToTop={handleMoveToTop} 
      />
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }} // Adjust height to leave space for the button
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            position={[marker.lat, marker.lng]} 
            icon={index === 0 ? firstMarkerIcon : customIcon} 
          >
            <Popup>
              Marker at [{marker.lat.toFixed(2)}, {marker.lng.toFixed(2)}]
              <br />
              <button onClick={() => handleDeleteMarker(index)}>Delete</button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapSection;
