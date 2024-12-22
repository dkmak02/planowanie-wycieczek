import "./App.css";
import MapSection from "./pages/MapSection";
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
      <MarkerProvider>
        <Navbar routeData={routeData} /> {/* Pass routeData to Navbar */}
        <div className="content">
          
          <Routes>
            <Route path="/" element={<MapSection />} />
            <Route
              path="/route-map"
              element={<RouteMapSection setRouteData={setRouteData}/>}
            />
          </Routes>
          
        </div>
        </MarkerProvider>
      </div>
    </Router>
  );
}

export default App;