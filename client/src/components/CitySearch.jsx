import React, { useState } from "react";
import "./../styles/CitySearch.css";

const CitySearch = ({ onAddCity }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
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
    const cityName = city.display_name.split(",")[0];
    const newCity = {
      name: cityName,
      lat: parseFloat(city.lat),
      lng: parseFloat(city.lon),
      time: 15,
      isStartingPoint: false,
    };
    onAddCity(newCity);
    setSearchResults((prev) =>
      prev.filter((result) => result.display_name !== city.display_name)
    );
  };

  const handleInputBlur = () => {
      setSearchQuery("");
      setSearchResults([]);
  };


  return (
    <div className="city-search" onMouseLeave={handleInputBlur}>
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Enter city name..."
      />
      <ul
      >
        {searchResults.map((result, index) => (
          <li key={index}>
            {result.display_name}{" "}
            <button onClick={() => handleAddCity(result)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CitySearch;
