import React, { createContext, useState, useContext, useEffect } from "react";

const MarkerContext = createContext();

export const MarkerProvider = ({ children }) => {
  const [markers, setMarkers] = useState(() => {
    const savedMarkers = sessionStorage.getItem("markers");
    return savedMarkers ? JSON.parse(savedMarkers) : [];
  });

  const [filteredData, setFilteredData] = useState(() => []);

  const [allData, setAllData] = useState(() => []);

  useEffect(() => {
    sessionStorage.setItem("markers", JSON.stringify(markers));
  }, [markers]);

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
