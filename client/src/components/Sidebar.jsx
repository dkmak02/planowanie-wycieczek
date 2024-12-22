import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import "../styles/Sidebar.css";
import MarkerForm from "./MarkerForm";
import CalculationForm from "./CalculationForm";
import Marker from "./Marker";
import Loading from "../utilities/Loading";
import { useNavigate } from "react-router-dom";
import { useMarkers } from "../context/MarkerContext";
import lz from "lz-string";
const ItemType = "MARKER";

const Sidebar = ({ markers, onDelete, onMarkerClick, onEdit }) => {
  const [loading, setLoading] = useState(false);
  const [showCalculationForm, setShowCalculationForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [markerName, setMarkerName] = useState("");
  const [markerTime, setMarkerTime] = useState(30);
  const {setFilteredData, setAllData} = useMarkers();
  const navigate = useNavigate();

  const handleCalculatePath = () => {
    setShowCalculationForm(true);
  };

  useEffect(() => {
    markers.forEach((marker, idx) => {
      marker.isStartingPoint = idx === 0;
    });
  }, [markers]);
  const getPathsFromAllData = (allData, paths) => {
    const pathsArray = [];
    paths.forEach((path) => {
      const pathDetails = allData.find(
        (data) => data.start === path[0] && data.end === path[1]
      );
      pathsArray.push(pathDetails);
    });
    return pathsArray;
  };
  const handleCalculate = async (maxHours, maxDays) => {
    setLoading(true);
    const requestBody = {
      markers,
      maxHours,
      maxDays,
    };

    try {
      const response = await fetch(`http://127.0.0.1:4000/paths`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      let result = await response.json();
      result = JSON.parse(lz.decompressFromUTF16(result.data));
      console.log(result);
      const transformData = (data) => {
        return Object.entries(data).map(([day, routes]) => ({
            day,
            routes: getPathsFromAllData(result.allData, routes),
        }));
    };
    const transformedData = transformData(result.filteredData);
      setFilteredData(transformedData);
      setAllData(result.allData);
      navigate("/route-map");
    } catch (error) {
      console.error("Error sending markers to server:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMarker = (index) => {
    setEditingIndex(index);
    setMarkerName(markers[index].name);
    setMarkerTime(markers[index].time || 30);
  };

  const handleSaveMarker = (e) => {
    e.preventDefault();
    if (
      markers.some(
        (marker, idx) =>
          marker.name.toLowerCase() === markerName.toLowerCase() && idx !== editingIndex
      )
    ) {
      alert("Marker name must be unique. Please choose a different name.");
      return;
    }
    const updatedMarkers = [...markers];
    updatedMarkers[editingIndex] = {
      ...updatedMarkers[editingIndex],
      name: markerName,
      time: markerTime,
    };
    setEditingIndex(null);
    onEdit(updatedMarkers);
  };

  const handleDragEnd = (fromIndex, toIndex) => {
    const reorderedMarkers = [...markers];
    const movedMarker = reorderedMarkers.splice(fromIndex, 1)[0];
    reorderedMarkers.splice(toIndex, 0, movedMarker);
    reorderedMarkers.forEach((marker, idx) => {
      marker.isStartingPoint = idx === 0;
    });
    onEdit(reorderedMarkers);
  };

  const MarkerWithDragDrop = ({ index, marker }) => {
    const [, drag] = useDrag({
      type: ItemType,
      item: { index },
    });

    const [, drop] = useDrop({
      accept: ItemType,
      hover: (item) => {
        if (item.index !== index) {
          handleDragEnd(item.index, index);
          item.index = index;
        }
      },
    });

    return (
      <li ref={(node) => drag(drop(node))}>
        <Marker
          index={index}
          name={marker.name}
          onDelete={onDelete}
          isActive={marker.isStartingPoint}
          onClick={() => onMarkerClick(marker.lat, marker.lng)}
          onEdit={() => handleEditMarker(index)}
        />
      </li>
    );
  };

  return (
    <div className="sidebar">
      <h2>Localizations</h2>
  
      {loading ? (
        <Loading />
      ) : (
        <div className="sidebar-content">
          <div className="marker-list">
            <ul>
              {markers.map((marker, index) => (
                <MarkerWithDragDrop key={index} index={index} marker={marker} />
              ))}
            </ul>
          </div>
  
          {markers.length >= 2 && (
            <button onClick={handleCalculatePath} className="calculate-button">
              Calculate Path
            </button>
          )}
  
          {showCalculationForm && (
            <CalculationForm
              onCalculate={handleCalculate}
              onClose={() => setShowCalculationForm(false)}
            />
          )}
  
          {editingIndex !== null && (
            <div className="edit-marker-form">
              <MarkerForm
                markerName={markerName}
                markerTime={markerTime}
                setMarkerName={setMarkerName}
                setMarkerTime={setMarkerTime}
                onSubmit={handleSaveMarker}
                onCancel={() => setEditingIndex(null)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;