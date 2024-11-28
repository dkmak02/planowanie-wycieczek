import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import UploadJson from "./UploadJson";
import DownloadJson from "./../PathPage/DownloadJson";
import "./Navbar.css";

const Navbar = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const location = useLocation();

  const handleUploadClick = () => {
    setShowUploadForm(true);
  };

  const handleCloseForm = () => {
    setShowUploadForm(false);
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Trip Planner</h1>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/route-map">Route Map</Link>{" "}
          </li>
        </ul>
        <div className="upload-box">
          {location.pathname === "/" && (
            <button onClick={handleUploadClick} className="upload-button">
              Upload JSON
            </button>
          )}
          {location.pathname === "/route-map" && <DownloadJson />}
        </div>
      </nav>
      {location.pathname === "/" && showUploadForm && (
        <UploadJson onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default Navbar;
