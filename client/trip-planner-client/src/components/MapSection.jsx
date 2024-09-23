import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents  } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = L.icon({
  iconUrl: '/map_location_marker.png', 
  iconSize: [38, 38],
  iconAnchor: [22, 38],
  popupAnchor: [-3, -38],
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
          console.log("Current Location:", latitude, longitude);
        },
        (error) => {
          console.error("Error retrieving location:", error);
          setPosition([51.505, -0.09]); 
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
        console.log("Marker added at:", lat, lng); // Log the coordinates
      },
      locationfound: (location) => {
        console.log('Location found:', location);
      },
    });
    return null;
  };

  if (loading) {
    return <div>Loading map...</div>;
  }

  return (
    <main className="main-section">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]} icon={customIcon}>
            <Popup>
              Marker at [{marker.lat.toFixed(2)}, {marker.lng.toFixed(2)}]
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </main>
  );
};

export default MapSection;
