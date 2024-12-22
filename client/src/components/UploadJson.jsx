import React from "react";
import "./../styles/UploadJson.css";
import { useNavigate } from "react-router-dom";
import { useMarkers } from "../context/MarkerContext";
import LZString from "lz-string";
const UploadJson = ({ onClose }) => {
  const navigate = useNavigate();
  const { setMarkers, setFilteredData, setAllData} = useMarkers();
  const handleOutsideClick = (event) => {
    if (event.target.className.includes("upload-modal")) {
      onClose();
    }
  };

  const validateJsonStructure = (jsonData) => {
    if (!jsonData || typeof jsonData !== "object") return false;
  
    // Validate `locations` array
    if (
      !Array.isArray(jsonData.locations) ||
      !jsonData.locations.every(
        (location) =>
          location &&
          typeof location.name === "string" &&
          typeof location.lat === "number" &&
          typeof location.lng === "number" &&
          typeof location.time === "number" &&
          typeof location.isStartingPoint === "boolean"
      )
    ) {
      
      return false;
    }
    setMarkers(jsonData.locations);
  
    // Validate `filteredData`
    if (
      !jsonData.filteredData ||
      typeof jsonData.filteredData !== "object" ||
      !Object.values(jsonData.filteredData).every(
        (day) =>
          Array.isArray(day) &&
          day.every(
            (item) =>
              item &&
              Array.isArray(item.paths) &&
              item.paths.every(
                (path) =>
                  path &&
                  typeof path.start === "string" &&
                  typeof path.end === "string" &&
                  Array.isArray(path.path) &&
                  path.path.every(
                    (segment) =>
                      segment &&
                      typeof segment.agg_cost === "number" &&
                      typeof segment.geoJSON === "object" &&
                      segment.geoJSON.type === "LineString" &&
                      Array.isArray(segment.geoJSON.coordinates) &&
                      segment.geoJSON.coordinates.every(
                        (coord) =>
                          Array.isArray(coord) &&
                          coord.length === 2 &&
                          typeof coord[0] === "number" &&
                          typeof coord[1] === "number"
                      )
                  )
              )
          )
      )
    ) {
      return false;
    }
    const filteredDataArray = Object.entries(jsonData.filteredData).map(([day, details]) => ({
      day,
      routes: details[0].paths,
      totalHours: details[0].totalHours,
      area: details[0].area,
      circuit: details[0].circuit,
    }));
    setFilteredData(filteredDataArray);

    if (
      !Array.isArray(jsonData.allData) ||
      !jsonData.allData.every(
        (route) =>
          route &&
          typeof route.start === "string" &&
          typeof route.end === "string" &&
          Array.isArray(route.path) &&
          route.path.every(
            (segment) =>
              segment &&
              typeof segment.agg_cost === "number" &&
              typeof segment.geoJSON === "object" &&
              segment.geoJSON.type === "LineString" &&
              Array.isArray(segment.geoJSON.coordinates) &&
              segment.geoJSON.coordinates.every(
                (coord) =>
                  Array.isArray(coord) &&
                  coord.length === 2 &&
                  typeof coord[0] === "number" &&
                  typeof coord[1] === "number"
              )
          )
      )
    ) {
      return false;
    }
    setAllData(jsonData.allData);
    return true; // Passed all validations
  };
  

  const uploadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const decompressedData = LZString.decompressFromUTF16(e.target.result);
                if (!decompressedData) {
                    throw new Error("Failed to decompress the file!");
                }
                const jsonData = JSON.parse(decompressedData);
                if (!validateJsonStructure(jsonData)) {
                    throw new Error("Invalid JSON structure!");
                }
                navigate("/route-map");
            } catch (err) {
                alert(err.message || "Invalid or corrupted JSON file!");
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
