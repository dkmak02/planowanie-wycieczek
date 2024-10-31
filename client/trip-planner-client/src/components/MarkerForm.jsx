import React from "react";
import "./MarkerForm.css";
const MarkerForm = ({ markerName, setMarkerName, onSubmit, onCancel }) => {
  return (
    <div className="marker-form-overlay">
      <form className="marker-form" onSubmit={onSubmit}>
        <label>
          Marker Name:
          <input
            type="text"
            value={markerName}
            onChange={(e) => setMarkerName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add Marker</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default MarkerForm;
