import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents  } from "react-leaflet";
import L from "leaflet";
import { DndProvider } from "react-dnd";
import { data, useLocation } from "react-router-dom";
import { HTML5Backend } from "react-dnd-html5-backend";
import PathSidebar from "../components/PathSidebar";
import "leaflet/dist/leaflet.css";
import "./../styles/RouteMapSection.css";
import Loading from "../utilities/Loading";
import { useMarkers } from "../context/MarkerContext";
import MarkerForm from "../components/MarkerForm";
import lz from "lz-string";

const firstMarkerIcon = L.icon({
  iconUrl: "/map_starter_marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});
const customIcon = L.icon({
  iconUrl: "/map_location_marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});
const dayColors = {
  day1: "blue",
  day2: "green",
  day3: "red",
  day4: "purple",
  day5: "orange",
};
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (event) => {
        const { lat, lng } = event.latlng;
        onMapClick(lat, lng);
    },
  });
  return null;
};
const RouteMapSection = () => {
  const [startingPoint, setStartingPoint] = useState(null);
  const [visibleRoutes, setVisibleRoutes] = useState({});
  const [sidebarData, setSidebarData] = useState([]);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [tempCoords, setTempCoords] = useState(null);
  const [markerName, setMarkerName] = useState("");
  const [markerTime, setMarkerTime] = useState(15);
  const {markers, setFilteredData, setAllData, filteredData = [] , allData, setMarkers} = useMarkers();
  useEffect(() => {
      const startingLocation = markers.find((location) => location.isStartingPoint);
      setStartingPoint(startingLocation);
      setPosition([startingLocation.lat, startingLocation.lng]);
      setZoom(12);
  }, []);
  useEffect(() => {
    map && map.setView(position, zoom);
  }, [position, zoom]);
  useEffect(() => {
    if (filteredData && startingPoint && markers.length > 0) {
      const updatedSidebarData = filteredData.map(({ day, routes, area, circuit }) => {
        const locations = Array.from(
          new Set(
            routes.flatMap(({ start, end }) => [start, end]) 
          )
        )
          .map((locationName) => {
            const location = markers.find((point) => point.name === locationName);
            const routeAggTime = routes
              .filter(({ end }) => end === locationName)
              .reduce((totalTime, { aggTime }) => totalTime + (aggTime || 0), 0);
            return location
              ? { name: location.name, time: location.time, aggTime: routeAggTime }
              : null;
          })
          .filter(
            (location) =>
              location && location.name !== startingPoint.name 
          );
        return { day, locations, area, circuit }; 
      });

      setSidebarData(updatedSidebarData);

    }
  }, [filteredData, startingPoint, markers]);
  const fixRoutesAfterDelete = (day, location) => {
    const updatedSidebarData = [...sidebarData];
    updatedSidebarData[day].locations = updatedSidebarData[day].locations.filter(
      (loc) => loc.name !== location.name
    );
    const newRoute = [startingPoint.name,...updatedSidebarData[day].locations.map((location) => location.name), startingPoint.name];
    const pairs = newRoute.map((location, index) => [location, newRoute[index + 1]]);
    const newRoutes = [];
    pairs.forEach((pair) => {
      const route = allData.find(
        (route) =>
          route.start === pair[0] && route.end === pair[1]
      );
      if (route) {
        route.aggTime =route.path[route.path.length - 1].agg_cost
        newRoutes.push(route);
      }
    });
    const updatedFilteredRoutesData = [...filteredData];
    updatedFilteredRoutesData[day].routes = newRoutes;
    setFilteredData(updatedFilteredRoutesData);
  }

  const adjustRoutesInSameDay = (day, sidebarDataIndex) => {
    const newRoute = [startingPoint.name,...sidebarData[sidebarDataIndex].locations.map((location) => location.name), startingPoint.name];
    const pairs = newRoute.map((location, index) => [location, newRoute[index + 1]]);
    const newRoutes = [];
    pairs.forEach((pair) => {
      const route = allData.find(
        (route) =>
          route.start === pair[0] && route.end === pair[1]
      );
      if (route) {
        route.aggTime =route.path[route.path.length - 1].agg_cost
        newRoutes.push(route);
      }
    });
    const filteredRoutesIndex = filteredData.findIndex((item) => item.day === day);
    const updatedFilteredRoutesData = [...filteredData];
    updatedFilteredRoutesData[filteredRoutesIndex].routes = newRoutes;
    setFilteredData(updatedFilteredRoutesData);
  };
  const adjustRoutesInDiffrentDay = (day, data) => {
    const filteredRoutesIndex = filteredData.findIndex((item) => item.day === day);
    const updatedFilteredRoutesData = [...filteredData];
    updatedFilteredRoutesData[filteredRoutesIndex].routes = data;
    setFilteredData(updatedFilteredRoutesData);
  };
  const fetchBestPathForDay = async (requestBody) => {
    try {
      const response = await fetch(`http://127.0.0.1:4000/paths/bestCombination`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
  
      let result = await response.json();
      result = JSON.parse(lz.decompressFromUTF16(result.data));
      result.filteredData.day1.forEach((path) => {
        const marker = markers.find((point) => point.name === path[1]);
        path.visitTime = marker ? (marker.time || 0) / 60 : 0; 
    });
      const routes = result.filteredData.day1.map((path) => {
        const route = allData.find((item) => item.start === path[0] && item.end === path[1]);
        if (route) {
            return {
                ...route,
                visitTime: markers.find((point) => point.name === path[1])?.time || 0
            };
        }
        return null;
    }).filter(Boolean); 

    return routes;
  } catch (error) {
    console.error('Error processing markers:', error);
    return [];
  }
  };
  const moveRoute = async (draggedDay, draggedRouteIndex, droppedDay, droppedRouteIndex) => {
    setLoading(true); 
    try {
      const updatedSidebarData = [...sidebarData];
      const draggedDayIndex = updatedSidebarData.findIndex((item) => item.day === draggedDay);
      const droppedDayIndex = updatedSidebarData.findIndex((item) => item.day === droppedDay);
      if (draggedDayIndex === -1 || droppedDayIndex === -1) return;

      const draggedRoute = updatedSidebarData[draggedDayIndex].locations.splice(draggedRouteIndex, 1)[0];
      updatedSidebarData[droppedDayIndex].locations.splice(droppedRouteIndex, 0, draggedRoute);
      setSidebarData(updatedSidebarData);

      if (draggedDay === droppedDay) {
        adjustRoutesInSameDay(draggedDay, draggedDayIndex);
      } else {
        const day1DataLocations = [markers.find((point) => point.name === startingPoint.name)];
        const day2DataLocations = [markers.find((point) => point.name === startingPoint.name)];

        sidebarData[draggedDayIndex].locations.forEach((location) => {
          day1DataLocations.push(markers.find((point) => point.name === location.name));
        });
        sidebarData[droppedDayIndex].locations.forEach((location) => {
          day2DataLocations.push(markers.find((point) => point.name === location.name));
        });
        const day1Names = day1DataLocations.map((location) => location.name);
        const day2Names = day2DataLocations.map((location) => location.name);
        const day1Data = allData.filter((route) => day1Names.includes(route.start) && day1Names.includes(route.end));
        const day2Data = allData.filter((route) => day2Names.includes(route.start) && day2Names.includes(route.end));
        const day1Request = {
          markers: day1DataLocations,
          decodedPaths: lz.compressToUTF16(JSON.stringify(day1Data)),
          maxHours: 24,
          maxDays: 1,
        };
        const day2Request = {
          markers: day2DataLocations,
          decodedPaths: lz.compressToUTF16(JSON.stringify(day2Data)),
          maxHours: 24,
          maxDays: 1,
        };
        const [day1, day2] = await Promise.all([
          fetchBestPathForDay(day1Request),
          fetchBestPathForDay(day2Request),
        ]);
        
        adjustRoutesInDiffrentDay(draggedDay, day1);
        adjustRoutesInDiffrentDay(droppedDay, day2);
      }
    } catch (error) {
      console.error("Error moving route:", error);
    } finally {
      setLoading(false); 
    }
  };
  const afterAddingNewMarkerRoute = (filteredIndex, updatedSidebarData, updateAllData) => {
    if (!startingPoint || !startingPoint.name) {
      console.error("Starting point is invalid or not set.");
      return;
    }
    const newRouteSequence = [
      startingPoint.name,
      ...updatedSidebarData[filteredIndex].locations.map((location) => location.name),
      startingPoint.name,
    ];
  
    const pairs = newRouteSequence.map((location, index, array) =>
      index < array.length - 1 ? [location, array[index + 1]] : null
    ).filter(Boolean);
  
    const newRoutes = pairs.map(([start, end]) => {
      const route = updateAllData.find((route) => route.start === start && route.end === end);
      if (route) {
        return {
          ...route,
          aggTime: route.path?.[route.path.length - 1]?.agg_cost || 0, 
        };
      } else {
        console.warn(`Route not found for pair: ${start} -> ${end}`);
        return null;
      }
    }).filter(Boolean); 
  
    const updatedFilteredRoutesData = [...filteredData];
    updatedFilteredRoutesData[filteredIndex] = {
      ...updatedFilteredRoutesData[filteredIndex],
      routes: newRoutes,
    };
    setFilteredData(updatedFilteredRoutesData);
    setAllData(updateAllData);
  };
  
  const calculateNewRoutes = async (newMarker) => {
    setLoading(true);
    const requestBody = {
      newMarker,
      markers,
    };
  
    try {
      const response = await fetch(`http://127.0.0.1:4000/paths/add-new-marker`, {
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
      const closestMarker = markers.reduce((acc, marker) => {
        const distance = Math.sqrt(
          Math.pow(marker.lat - newMarker.lat, 2) + Math.pow(marker.lng - newMarker.lng, 2)
        );
        if (distance < acc.distance) {
          return { marker, distance };
        }
        return acc;
      }, { marker: null, distance: Infinity }).marker;
      const dayIndex = sidebarData.findIndex((item) => item.locations.some((loc) => loc.name === closestMarker.name));
  
      const updatedSidebarData = [...sidebarData];
      updatedSidebarData[dayIndex].locations.push({
        name: newMarker.name,
        time: newMarker.time,
        aggTime: 0.1,
      });
      const updateAllData = [...allData, ...result];
      
  
      afterAddingNewMarkerRoute(dayIndex, updatedSidebarData, updateAllData);
    } catch (error) {
      console.error("Error sending markers to server:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (markers.some((marker) => marker.name.toLowerCase() === markerName.toLowerCase())) {
      alert("Marker name must be unique.");
      return;
    }
    const newMarker = { lat: tempCoords[0], lng: tempCoords[1], time: markerTime, name: markerName, isStartingPoint: false };
    calculateNewRoutes(newMarker);
    setMarkers((prev) => [
      ...prev,
      newMarker,
    ]);
    setShowForm(false);
    setMarkerName("");
    setMarkerTime(15);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setMarkerName("");
    setMarkerTime(15);
  };
  const handleMapClick = (lat, lng) => {
    if (!showForm) {
      setTempCoords([lat, lng]);
      setShowForm(true);
    }
  };
  const renderMarkers = () => {
    return markers
      .filter((point) => {
        const isPartOfVisibleRoute = filteredData.some(
          (dayData) =>
            visibleRoutes[dayData.day] !== false &&
            dayData.routes.some(
              (route) => route.start === point.name || route.end === point.name
            )
        );
        return isPartOfVisibleRoute;
      })
      .map((point, index) => (
        
        <Marker key={index} position={[point.lat, point.lng]} icon={point.isStartingPoint ? firstMarkerIcon : customIcon}>
          <Popup>{point.name}</Popup>
        </Marker>
      ));
  };

  const renderRoutes = () => {
    return filteredData.map((dayData, dayIndex) => {
      const { day, routes } = dayData;
      if (visibleRoutes[day] !== false) {
        return routes.map((route, routeIndex) =>
          route.path?.map((segment, segmentIndex) => {
            if (
              segment.geoJSON &&
              segment.geoJSON.coordinates &&
              segment.geoJSON.coordinates.length > 0
            ) {
              const coordinates = segment.geoJSON.coordinates.map(([lon, lat]) => [lat, lon]);
              const pathColor = dayColors[day] || "gray";
              return (
                <Polyline
                  key={`route-${dayIndex}-${routeIndex}-${segmentIndex}`}
                  positions={coordinates}
                  color={pathColor}
                  weight={4}
                />
              );
            }
            return null;
          })
        );
      }
      return null;
    });
  };
  
  return loading ? (
    <Loading />
  ) : (
    <DndProvider backend={HTML5Backend}>
      <div className="map-container">
        <MapContainer
          center={position}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          ref={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onMapClick={handleMapClick} />
         {renderRoutes()}
          {renderMarkers()}
        </MapContainer>
      </div>
      {showForm && (
        <MarkerForm
          markerName={markerName}
          setMarkerName={setMarkerName}
          markerTime={markerTime}
          setMarkerTime={setMarkerTime}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}
      <PathSidebar
        routesData={sidebarData}
        moveRoute={moveRoute}
        setVisibleRoutes={setVisibleRoutes}
        visibleRoutes={visibleRoutes}
        fixRoutesAfterDelete={fixRoutesAfterDelete}
      />
    </DndProvider>
  );
};

export default RouteMapSection;
