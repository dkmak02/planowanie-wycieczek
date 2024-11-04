import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Sidebar from "./Sidebar";
import MarkerForm from "./MarkerForm";
import "./MapSection.css";

const customIcon = L.icon({
  iconUrl: "/map_location_marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const firstMarkerIcon = L.icon({
  iconUrl: "/map_starter_marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const MapClickHandler = ({ onMapClick, showForm, deleting }) => {
  useMapEvents({
    click: (event) => {
      if (!showForm && !deleting) {
        const { lat, lng } = event.latlng;
        onMapClick(lat, lng);
      }
    },
  });
  return null;
};

const MapSection = () => {
  const [markers, setMarkers] = useState([]);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tempCoords, setTempCoords] = useState(null);
  const [markerName, setMarkerName] = useState("");
  const [markerTime, setMarkerTime] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [map, setMap] = useState(null);
  const [restingPlace, setRestingPlace] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setLoading(false);
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

  const handleMapClick = (lat, lng) => {
    if (!showForm && !deleting) {
      setTempCoords([lat, lng]);
      setShowForm(true);
    }
  };

  const handleFormSubmit = (e) => {
    console.log(tempCoords, markerName, restingPlace);
    e.preventDefault();
    setMarkers((prevMarkers) => [
      ...prevMarkers,
      {
        lat: tempCoords[0],
        lng: tempCoords[1],
        name: markerName,
        isRestingPlace: restingPlace,
      },
    ]);
    setShowForm(false);
    setMarkerName("");
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setMarkerName("");
  };

  const handleDeleteMarker = (index) => {
    setDeleting(true);
    setMarkers((prevMarkers) => prevMarkers.filter((_, i) => i !== index));
    setTimeout(() => {
      setDeleting(false);
    }, 100);
  };
  const moveToMarker = (lat, lng) => {
    if (map) {
      map.setView([lat, lng], map._zoom);
    }
  };

  if (loading) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="content">
      <Sidebar
        markers={markers}
        onDelete={handleDeleteMarker}
        onMarkerClick={moveToMarker}
      />
      <div className="map-container">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100vh", width: "100%" }}
          ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler
            onMapClick={handleMapClick}
            showForm={showForm}
            deleting={deleting}
          />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.lat, marker.lng]}
              icon={marker.isRestingPlace ? firstMarkerIcon : customIcon}
            >
              <Popup>
                {marker.name ||
                  `Marker at [${marker.lat.toFixed(2)}, ${marker.lng.toFixed(
                    2
                  )}]`}
                <br />
                <button onClick={() => handleDeleteMarker(index)}>
                  Delete
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {showForm && (
        <MarkerForm
          markerName={markerName}
          setMarkerName={setMarkerName}
          markerTime={markerTime}
          setMarkerTime={setMarkerTime}
          restingPlace={restingPlace}
          setRestingPlace={setRestingPlace}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default MapSection;
