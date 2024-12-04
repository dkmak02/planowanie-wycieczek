import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./CitySearch.css"; 

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
    }, 500);

    setDebounceTimeout(timeout);
  };

  const handleAddCity = (city) => {
    if (selectedCities.some((c) => c.name === city.display_name.split(",")[0])) return;
  
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
  const handleDeleteCity = (index) => {
    setSelectedCities((prevCities) =>
      prevCities.filter((_, cityIndex) => cityIndex !== index)
    );
  };
  

  return (
    <div className="container">
      <h2 className="heading">City Search</h2>
      <div className="inputContainer">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Enter city name..."
          className="input"
        />
      </div>

      <div className="resultsContainer">
        <h3>Search Results</h3>
        {searchResults.length > 0 ? (
          <ul className="resultsList">
            {searchResults.map((result, index) => (
              <li key={index} className="resultItem">
                <span>{result.display_name}</span>
                <button
                  onClick={() => handleAddCity(result)}
                  className="addButton"
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


      <div className="selectedCitiesContainer">
        <h3>Selected Cities</h3>
        {selectedCities.length > 0 ? (
          <ul className="selectedCitiesList">
            {selectedCities.map((city, index) => (
              <li key={index} className="selectedCityItem">
                <span>{city.name}</span>
                <button
                  className="deleteButton"
                  onClick={() => handleDeleteCity(index)} // Delete city on button click
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No cities added</p>
        )}
      </div>
      <div className="continueButtonContainer">
        <button
          onClick={handleContinue}
          className="continueButton"
          disabled={selectedCities.length === 0} 
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CitySearch;
