import React, { useEffect, useRef } from "react";
import "./../styles/MarkerForm.css";

const MarkerForm = ({
  markerName,
  setMarkerName,
  markerTime,
  setMarkerTime,
  onSubmit,
  onCancel,
}) => {
  const handleSliderChange = (e) => {
    setMarkerTime(Number(e.target.value));
  };
  const sliderRef = useRef(null);
  const bulletRef = useRef(null);
  useEffect(() => {
    if (sliderRef.current && bulletRef.current) {
      const value = markerTime;
      const max = 720;
      const percentage = value / max;
      const offset = percentage * 250;
      bulletRef.current.style.left = `${offset}px`;
    }
  }, [markerTime]);
  return (
    <div className="marker-form-overlay" onMouseDown={onCancel}>
      <form
        className="marker-form"
        onSubmit={onSubmit}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <input
          placeholder="Enter destination name"
          type="text"
          id="destination"
          defaultValue={markerName}
          onChange={(e) => setMarkerName(e.target.value)}
          required
        />
        <div className="container2">
          <label className="form-label">
            <h3>visit time</h3>
          </label>
          <div className="range-slider">
            <span id="rs-bullet" ref={bulletRef} className="rs-label">
              {markerTime}
            </span>
            <input
              type="range"
              id="time"
              className="rs-range"
              ref={sliderRef}
              value={markerTime}
              onChange={handleSliderChange}
              min="0"
              max="720"
              step="15"
            />
          </div>

          <div className="box-minmax">
            <span>0</span>
            <span>720</span>
          </div>
        </div>

        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default MarkerForm;
