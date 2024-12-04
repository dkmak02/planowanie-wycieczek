import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook for navigation
import styles from "./CitySearch.css"; // Import the CSS module

const CitySearch = ({ onAddCity }) => {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchResults, setSearchResults] = useState([]); 
  const [selectedCities, setSelectedCities] = useState([]); 
  const [debounceTimeout, setDebounceTimeout] = useState(null); 

  const navigate = useNavigate(); 

  const fetchCityData = async (query) => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&extratags=1&addressdetails=1&countrycodes=PL&place=city`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch city data");
      }

      const data = await response.json();
      const filteredResults = data.filter((result) => {
        return result.addresstype === "town" || result.addresstype === "city";
      });

      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching for cities:", error);
      setSearchResults([]); 
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      fetchCityData(query); 
    }, 1000);

    setDebounceTimeout(timeout);
  };

  const handleAddCity = (city) => {
    if (selectedCities.some((c) => c.display_name === city.display_name)) return;
  
    const newCity = {
      name: city.display_name.split(",")[0],
      lat: parseFloat(city.lat),
      lng: parseFloat(city.lon), 
      time: 30,
    };
    setSelectedCities((prevCities) => [...prevCities, newCity]);
    if (onAddCity) onAddCity(newCity);
  };
  const handleContinue = () => {
    navigate("/main", {
      state: { selectedCities }, 
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>City Search</h2>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Enter city name..."
          className={styles.input}
        />
      </div>

      <div className={styles.resultsContainer}>
        <h3>Search Results</h3>
        {searchResults.length > 0 ? (
          <ul className={styles.resultsList}>
            {searchResults.map((result, index) => (
              <li key={index} className={styles.resultItem}>
                <span>{result.display_name}</span>
                <button
                  onClick={() => handleAddCity(result)}
                  className={styles.addButton}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>

      <div className={styles.selectedCitiesContainer}>
        <h3>Selected Cities</h3>
        {selectedCities.length > 0 ? (
          <ul className={styles.selectedCitiesList}>
            {selectedCities.map((city, index) => (
              <li key={index} className={styles.selectedCityItem}>
                {city.display_name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No cities added</p>
        )}
      </div>
      <div className={styles.continueButtonContainer}>
        <button
          onClick={handleContinue}
          className={styles.continueButton}
          disabled={selectedCities.length === 0} 
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CitySearch;
