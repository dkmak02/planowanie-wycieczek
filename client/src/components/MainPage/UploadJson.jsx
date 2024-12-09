import React from "react";
import "./UploadJson.css";
import { useNavigate } from "react-router-dom";

const UploadJson = ({ onClose }) => {
  const navigate = useNavigate();

  const handleOutsideClick = (event) => {
    if (event.target.className.includes("upload-modal")) {
      onClose();
    }
  };

  const validateJsonStructure = (jsonData) => {
    // Check top-level properties
    if (!jsonData || typeof jsonData !== "object") return false;
    if (!Array.isArray(jsonData.locations) || typeof jsonData.filteredData !== "object" || typeof jsonData.allData !== "object") return false;

    // Validate `locations` array
    const validLocations = jsonData.locations.every(
      (location) =>
        location &&
        typeof location.name === "string" &&
        typeof location.lat === "number" &&
        typeof location.lng === "number" &&
        typeof location.time === "number" &&
        typeof location.isStartingPoint === "boolean"
    );
    if (!validLocations) return false;

    // Validate `filteredData` object
    const validFilteredData = Object.values(jsonData.filteredData).every((dayRoutes) =>
      Array.isArray(dayRoutes) &&
      dayRoutes.every(
        (route) =>
          route &&
          typeof route.start === "string" &&
          typeof route.end === "string" &&
          Array.isArray(route.path) &&
          route.path.every(
            (pathSegment) =>
              pathSegment &&
              typeof pathSegment.agg_cost === "number" &&
              typeof pathSegment.geoJSON === "object" &&
              pathSegment.geoJSON.type === "LineString" &&
              Array.isArray(pathSegment.geoJSON.coordinates) &&
              pathSegment.geoJSON.coordinates.every(
                (coord) => Array.isArray(coord) && coord.length === 2 && typeof coord[0] === "number" && typeof coord[1] === "number"
              )
          )
      )
    );
    if (!validFilteredData) return false;

    // Validate `allData` object
    const validAllData = Object.values(jsonData.allData).every(
      (route) =>
        route &&
        typeof route.start === "string" &&
        typeof route.end === "string" &&
        Array.isArray(route.path) &&
        route.path.every(
          (pathSegment) =>
            pathSegment &&
            typeof pathSegment.agg_cost === "number" &&
            typeof pathSegment.geoJSON === "object" &&
            pathSegment.geoJSON.type === "LineString" &&
            Array.isArray(pathSegment.geoJSON.coordinates) &&
            pathSegment.geoJSON.coordinates.every(
              (coord) => Array.isArray(coord) && coord.length === 2 && typeof coord[0] === "number" && typeof coord[1] === "number"
            )
        )
    );
    if (!validAllData) return false;

    return true;
  };

  const uploadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (!validateJsonStructure(jsonData)) {
            throw new Error("Invalid JSON structure!");
          }
          navigate("/route-map", { state: { result: jsonData } });
        } catch (err) {
          alert(err.message || "Invalid JSON file!");
        }
      };
      reader.readAsText(file);
    }
    onClose();
  };

  return (
    <div className="upload-modal" onMouseDown={handleOutsideClick}>
      <div className="upload-form">
        <h2>Upload JSON File</h2>
        <input
          type="file"
          accept=".json"
          onChange={uploadFile}
          className="file-input"
        />
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default UploadJson;
