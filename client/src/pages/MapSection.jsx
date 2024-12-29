import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker as LeafletMarker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Sidebar from "../components/Sidebar";
import MarkerForm from "../components/MarkerForm";
import "../styles/MapSection.css";
import { useLocation } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useMarkers } from "../context/MarkerContext";
import CitySearch from "../components/CitySearch";
import { DivIcon } from 'leaflet';

const firstMarkerIcon = L.icon({
  iconUrl: "/map_starter_marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const MapClickHandler = ({ onMapClick, showForm }) => {
  useMapEvents({
    click: (event) => {
      if (!showForm) {
        const { lat, lng } = event.latlng;
        onMapClick(lat, lng);
      }
    },
  });
  return null;
};

const MapSection = () => {
  const { state } = useLocation();
  const { markers, setMarkers } = useMarkers();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tempCoords, setTempCoords] = useState(null);
  const [markerName, setMarkerName] = useState("");
  const [markerTime, setMarkerTime] = useState(15);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (state && state.selectedCities) {
      setMarkers(state.selectedCities);
    }
  }, [state]);

  useEffect(() => {
    if (markers.length > 0) {
      const startingPoint = markers[0];
      setPosition([startingPoint.lat, startingPoint.lng]);
      setLoading(false);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setLoading(false);
        },
        () => {
          setPosition([51.505, -0.09]);
          setLoading(false);
        }
      );
    } else {
      setPosition([51.505, -0.09]);
      setLoading(false);
    }
  }, [markers]);

  const handleMapClick = (lat, lng) => {
    if (!showForm) {
      setTempCoords([lat, lng]);
      setShowForm(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (markers.some((marker) => marker.name.toLowerCase() === markerName.toLowerCase())) {
      alert("Marker name must be unique.");
      return;
    }
    setMarkers((prev) => [
      ...prev,
      { lat: tempCoords[0], lng: tempCoords[1], time: markerTime, name: markerName, isStartingPoint: false },
    ]);
    setShowForm(false);
    setMarkerName("");
    setMarkerTime(15);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setMarkerName("");
    setMarkerTime(15);
  };

  const handleAddMarkerFromSearch = (marker) => {
    if (markers.some((m) => m.name === marker.name)) {
      alert("Marker already added.");
      return;
    }

    setMarkers((prev) => [...prev, marker]);
  };
    const createCustomIconWithText = (text) => {
      return new DivIcon({
        className: "custom-div-icon",
        html: `<div class="icon-wrapper">
                 <div class="icon-text">${text}</div>
               </div>`,
        iconSize: [30, 42], 
        iconAnchor: [15, 42], 
      });
    };
  if (loading) {
    return <div>Loading map...</div>;
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
       <CitySearch onAddCity={handleAddMarkerFromSearch} />
      <div className="content">
        <Sidebar
          markers={markers}
          onDelete={(index) => setMarkers((prev) => prev.filter((_, i) => i !== index))}
          onMarkerClick={(lat, lng) => map && map.setView([lat, lng], map.getZoom())}
          onEdit={setMarkers}
        />
        <div className="map-container">
          <MapContainer center={position} zoom={13}  ref={setMap}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler onMapClick={handleMapClick} showForm={showForm} />
            {markers.map((marker, index) => (
              <LeafletMarker
                key={index}
                position={[marker.lat, marker.lng]}
                icon={
                  index === 0
                    ? firstMarkerIcon
                    : createCustomIconWithText(marker.name) 
                }
              >
                <Popup>
                  <div>{marker.name}</div>
                </Popup>
              </LeafletMarker>
            ))}
          </MapContainer>
        </div>
        {showForm && (
          <MarkerForm
            markerName={markerName}
            setMarkerName={setMarkerName}
            markerTime={markerTime}
            setMarkerTime={setMarkerTime}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default MapSection;
