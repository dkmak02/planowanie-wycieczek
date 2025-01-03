import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import UploadJson from "./UploadJson";
import DownloadJson from "./DownloadJson";
import "./../styles/Navbar.css";

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
        <Link to="/"> <h1 className="name">Trip Planner</h1></Link>
        <div className="upload-box">
          {location.pathname === "/" && (
            <button onClick={handleUploadClick} className="upload-button">
              Upload JSON
            </button>
          )}
          {location.pathname === "/route-map"  && (
            <DownloadJson /> 
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
