import React, { createContext, useState, useContext, useEffect } from "react";

const MarkerContext = createContext();

export const MarkerProvider = ({ children }) => {
  const [markers, setMarkers] = useState(() => {
    const savedMarkers = sessionStorage.getItem("markers");
    return savedMarkers ? JSON.parse(savedMarkers) : [];
  });

  const [filteredData, setFilteredData] = useState(() => {
    const savedFilteredData = sessionStorage.getItem("filteredData");
    return savedFilteredData ? JSON.parse(savedFilteredData) : [];
  });

  const [allData, setAllData] = useState(() => {
    const savedAllData = sessionStorage.getItem("allData");
    return savedAllData ? JSON.parse(savedAllData) : [];
  });

  // Save to sessionStorage whenever data changes
  useEffect(() => {
    sessionStorage.setItem("markers", JSON.stringify(markers));
  }, [markers]);

  useEffect(() => {
    sessionStorage.setItem("filteredData", JSON.stringify(filteredData));
  }, [filteredData]);

  useEffect(() => {
    sessionStorage.setItem("allData", JSON.stringify(allData));
  }, [allData]);

  return (
    <MarkerContext.Provider
      value={{
        markers,
        setMarkers,
        filteredData,
        setFilteredData,
        allData,
        setAllData,
      }}
    >
      {children}
    </MarkerContext.Provider>
  );
};

export const useMarkers = () => useContext(MarkerContext);
