import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/CitySearch.css";

const CitySearch = ({ onAddCity }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allSearchResults, setAllSearchResults] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const navigate = useNavigate();

  const fetchCityData = async (query) => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&extratags=1&addressdetails=1&countrycodes=PL`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch city data");
      }

      const data = await response.json();

    const uniqueResults = data.filter(
      (city, index, self) =>
        index === self.findIndex((c) => c.display_name === city.display_name)
    );

    setSearchResults(uniqueResults);
    setAllSearchResults(uniqueResults);
  } catch (error) {
    console.error("Error searching for cities:", error);
    setSearchResults([]);
    setAllSearchResults([]);
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
    const cityName = city.display_name.split(",")[0];

    if (selectedCities.some((c) => c.name === cityName)) return;

    const newCity = {
      name: cityName,
      lat: parseFloat(city.lat),
      lng: parseFloat(city.lon),
      time: 30,
      isStartingPoint: false,
    };

    setSelectedCities((prevCities) => [...prevCities, newCity]);
    setSearchResults((prevResults) =>
      prevResults.filter((result) => result.display_name !== city.display_name)
    );

    if (onAddCity) onAddCity(newCity);
  };

  const handleDeleteCity = (index) => {
    const cityToDelete = selectedCities[index];

    setSelectedCities((prevCities) =>
      prevCities.filter((_, cityIndex) => cityIndex !== index)
    );

    const restoredCity = allSearchResults.find(
      (result) => result.display_name.split(",")[0] === cityToDelete.name
    );

    if (restoredCity) {
      setSearchResults((prevResults) => [...prevResults, restoredCity]);
    }
  };

  const handleContinue = () => {
    navigate("/main", { state: { selectedCities } });
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
    <h3 className="selectedCitiesHeader">Selected Cities</h3>
    {selectedCities.length > 0 ? (
      <ul className="selectedCitiesList">
        {selectedCities.map((city, index) => (
          <li key={index} className="selectedCityItem">
            <span>{city.name}</span>
            <button
              className="deleteButton"
              onClick={() => handleDeleteCity(index)}
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
    >
      Continue
    </button>
  </div>
</div>
  
  );
};

export default CitySearch;
