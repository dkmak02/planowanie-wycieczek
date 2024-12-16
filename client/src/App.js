import "./App.css";
import MapSection from "./pages/MapSection";
import CitySearch from "./pages/CitySearch";
import Navbar from "./components/Navbar";
import RouteMapSection from "./pages/RouteMapSection";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { MarkerProvider } from "./context/MarkerContext";

function App() {
  const [routeData, setRouteData] = useState(null);

  return (
    <Router>
      <div className="App">
        <Navbar routeData={routeData} /> {/* Pass routeData to Navbar */}
        <div className="content">
          <MarkerProvider>
          <Routes>
            <Route path="/" element={<CitySearch />} />
            <Route path="/main" element={<MapSection />} />
            <Route
              path="/route-map"
              element={<RouteMapSection setRouteData={setRouteData}/>}
            />
          </Routes>
          </MarkerProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;