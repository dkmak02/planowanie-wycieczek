import "./App.css";
import MapSection from "./components/MainPage/MapSection";
import Navbar from "./components/MainPage/Navbar";
import RouteMapSection from "./components/PathPage/RouteMapSection";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<MapSection />} />
            <Route path="/route-map" element={<RouteMapSection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
