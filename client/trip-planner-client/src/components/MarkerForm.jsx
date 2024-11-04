import React from "react";
import "./MarkerForm.css";

const MarkerForm = ({
  markerName,
  setMarkerName,
  markerTime,
  setMarkerTime,
  restingPlace,
  setRestingPlace,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="marker-form-overlay" onMouseDown={onCancel}>
      <form
        className="marker-form"
        onSubmit={onSubmit}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <label className="form-label">
          <h3>Destination</h3>
        </label>
        <input
          placeholder="Enter destination"
          type="text"
          id="destination"
          value={markerName}
          onChange={(e) => setMarkerName(e.target.value)}
          required
        />

        <label className="form-label">
          <h3>Time (in minutes)</h3>
        </label>
        <input
          placeholder="Enter time in minutes"
          type="number"
          id="time"
          value={markerTime}
          onChange={(e) => {
            const value = Math.max(0, Math.min(1440, e.target.value));
            if (value % 30 === 0 || value === "") {
              setMarkerTime(value);
            }
          }}
          required
          min="0"
          max="1440"
          step="30"
        />

        <div>
          <div className="custom-input">
            <input
              type="radio"
              id="radio-no"
              name="restingplace"
              value="no"
              defaultChecked
              onChange={() => setRestingPlace(false)}
            />
            <label htmlFor="radio-no">PLACE TO VISIT</label>
          </div>
          <div className="custom-input">
            <input
              type="radio"
              id="radio-yes"
              name="restingplace"
              value="yes"
              onChange={() => setRestingPlace(true)}
            />
            <label htmlFor="radio-yes">RESTING PLACE</label>
          </div>
        </div>

        <button type="submit">Add Marker</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default MarkerForm;
