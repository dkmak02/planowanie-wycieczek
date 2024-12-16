import React, { useState } from "react";
import "./../styles/CalculationForm.css";

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

  const incrementHours = () =>
    setMaxHours((prev) => Math.min(24, Number(prev) + 1));
  const decrementHours = () =>
    setMaxHours((prev) => Math.max(1, Number(prev) - 1));

  const incrementDays = () =>
    setMaxDays((prev) => Math.min(365, Number(prev) + 1));
  const decrementDays = () =>
    setMaxDays((prev) => Math.max(1, Number(prev) - 1));

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
        <form onSubmit={handleSubmit}>
          <div className="custom-number-input">
            <label>
              Maximum Hours per Day:
              <div className="input-wrapper">
                <button type="button" onClick={decrementHours}>
                  −
                </button>
                <input
                  type="number"
                  value={maxHours}
                  onChange={handleMaxHoursChange}
                  onKeyDown={handleKeyDown}
                  min="1"
                  max="24"
                  required
                />
                <button type="button" onClick={incrementHours}>
                  +
                </button>
              </div>
            </label>
          </div>
          <div className="custom-number-input">
            <label>
              Maximum Quantity of Days:
              <div className="input-wrapper">
                <button type="button" onClick={decrementDays}>
                  −
                </button>
                <input
                  type="number"
                  value={maxDays}
                  onChange={handleMaxDaysChange}
                  onKeyDown={handleKeyDown}
                  min="1"
                  max="365"
                  required
                />
                <button type="button" onClick={incrementDays}>
                  +
                </button>
              </div>
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
