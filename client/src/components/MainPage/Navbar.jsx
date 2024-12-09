import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import UploadJson from "./UploadJson";
import DownloadJson from "./../PathPage/DownloadJson";
import "./Navbar.css";

const Navbar = ({ routeData }) => { // Accept routeData as a prop
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
        <Link to="/"> <h1 className="name">Trip Planner</h1></Link>
        <div className="upload-box">
          {location.pathname === "/" && (
            <button onClick={handleUploadClick} className="upload-button">
              Upload JSON
            </button>
          )}
          {location.pathname === "/route-map" && routeData && (
            <DownloadJson data={routeData} /> 
          )}
        </div>
      </nav>
      {location.pathname === "/" && showUploadForm && (
        <UploadJson onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default Navbar;
