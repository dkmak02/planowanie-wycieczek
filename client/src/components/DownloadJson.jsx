import React from "react";
import LZString from "lz-string";
import { useMarkers } from "../context/MarkerContext";
const DownloadJson = () => {
  const {allData, markers, filteredData} = useMarkers() 
  const fixData = (data) => {
    const filteredDataObj = {};
    for (const day in data) {
      data[day].paths = data[day].routes;
      delete data[day].routes;
      filteredDataObj[data[day].day] = [data[day]];
    }
    return filteredDataObj;
  };
  const handleDownload = () => {
    const fileName = "route-data.json";
    const newData = {}; 
    const filetedDataObjCopy = JSON.parse(JSON.stringify(filteredData));
    const filetedDataObj = fixData(filetedDataObjCopy);
    newData.filteredData = filetedDataObj;
    newData.locations = markers
    newData.allData = allData
    const compressedData = LZString.compressToUTF16(JSON.stringify(newData));
    const blob = new Blob([compressedData], { type: "application/json" });
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
