import React from "react";

const DownloadJson = () => {
  const handleDownload = () => {
    const sampleData = {
      routes: [
        { start: "A1", end: "A2", distance: "5km" },
        { start: "A2", end: "A3", distance: "7km" },
      ],
    };

    const fileName = "route-data.json";
    const jsonStr = JSON.stringify(sampleData, null, 2);

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
