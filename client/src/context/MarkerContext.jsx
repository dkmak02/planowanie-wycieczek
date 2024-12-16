// MarkerContext.js
import React, { createContext, useState, useContext } from "react";

const MarkerContext = createContext();

export const MarkerProvider = ({ children }) => {
  const [markers, setMarkers] = useState([]);

  return (
    <MarkerContext.Provider value={{ markers, setMarkers }}>
      {children}
    </MarkerContext.Provider>
  );
};

export const useMarkers = () => useContext(MarkerContext);
