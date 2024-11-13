import React, { useState } from "react";
import "./CalculationForm.css";

const CalculationForm = ({ onCalculate, onClose }) => {
  const [maxHours, setMaxHours] = useState("");
  const [maxDays, setMaxDays] = useState("");

  const handleMaxHoursChange = (e) => {
    const value = e.target.value;
    if (value === "" || (value >= 1 && value <= 24)) {
      setMaxHours(value);
    }
  };

  const handleMaxDaysChange = (e) => {
    const value = e.target.value;
    if (value === "" || (value >= 1 && value <= 365)) {
      setMaxDays(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(maxHours, maxDays);
    onClose();
  };

  return (
    <div className="calculation-form-overlay" onMouseDown={onClose}>
      <div
        className="calculation-form"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2>Calculation Form</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Maximum Hours per Day:
              <input
                type="number"
                value={maxHours}
                onChange={handleMaxHoursChange}
                onKeyDown={handleKeyDown}
                min="1"
                max="24"
                required
              />
            </label>
          </div>
          <div>
            <label>
              Maximum Quantity of Days:
              <input
                type="number"
                value={maxDays}
                onChange={handleMaxDaysChange}
                onKeyDown={handleKeyDown}
                min="1"
                max="365"
                required
              />
            </label>
          </div>
          <button type="submit" className="submit-button">
            Calculate
          </button>
          <button type="button" onClick={onClose} className="close-button">
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default CalculationForm;
