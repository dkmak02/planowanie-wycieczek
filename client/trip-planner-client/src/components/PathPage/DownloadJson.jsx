import React from "react";

const DownloadJson = ({ data }) => { // Accept data as a prop
  const handleDownload = () => {
    const fileName = "route-data.json";
    const jsonStr = JSON.stringify(data, null, 2); // Use the passed data
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} className="download-button">
      Download JSON
    </button>
  );
};

export default DownloadJson;
