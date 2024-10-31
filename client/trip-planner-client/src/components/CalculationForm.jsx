import React, { useState } from "react";
import "./CalculationForm.css"; // Ensure you have this CSS file

const CalculationForm = ({ onCalculate, onClose }) => {
  const [maxHours, setMaxHours] = useState("");
  const [maxDays, setMaxDays] = useState("");

  const handleMaxHoursChange = (e) => {
    const value = e.target.value;

    // Check if value is empty or a valid number between 0 and 24
    if (value === "" || (value >= 0 && value <= 24)) {
      setMaxHours(value);
    }
  };

  const handleMaxDaysChange = (e) => {
    const value = e.target.value;

    // Check if value is empty or a valid non-negative number
    if (value === "" || (value >= 0 && value <= 365)) {
      setMaxDays(value);
    }
  };

  const handleKeyDown = (e) => {
    // Prevent negative sign and any non-numeric input
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onCalculate function with valid values
    onCalculate(maxHours, maxDays);
    onClose(); // Close the form after calculation
  };

  return (
    <div className="calculation-form">
      <h2>Calculation Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Maximum Hours per Day:
            <input
              type="number"
              value={maxHours}
              onChange={handleMaxHoursChange}
              onKeyDown={handleKeyDown} // Block negative sign and non-numeric input
              min="0"
              max="24"
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
              onKeyDown={handleKeyDown} // Block negative sign and non-numeric input
              min="0"
              max="365"
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
  );
};

export default CalculationForm;
