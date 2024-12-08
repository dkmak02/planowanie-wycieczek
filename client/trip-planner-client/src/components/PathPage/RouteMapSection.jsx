import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { DndProvider } from "react-dnd";
import { useLocation } from "react-router-dom";
import { HTML5Backend } from "react-dnd-html5-backend";
import PathSidebar from "./PathSidebar";
import "leaflet/dist/leaflet.css";
import "./RouteMapSection.css";

const firstMarkerIcon = L.icon({
  iconUrl: "/map_starter_marker.png",
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

const RouteMapSection = () => {
  const { state } = useLocation();
  const [startingPoint, setStartingPoint] = useState(null);
  const [filteredRoutesData, setFilteredRoutesData] = useState([]); // Initialize as an array
  const [allRoutesData, setAllRoutesData] = useState([]);
  const [pointsData, setPointsData] = useState([]);
  const [visibleRoutes, setVisibleRoutes] = useState({});
  const [sidebarData, setSidebarData] = useState([]);

  useEffect(() => {
    if (state && state.result) {
      const { result } = state;
      const filteredDataArray = Object.entries(result.filteredData).map(([day, routes]) => ({
        day,
        routes,
      }));
      const startingLocation = result.locations.find((location) => location.isStartingPoint);
      setStartingPoint(startingLocation.name);
      setFilteredRoutesData(filteredDataArray);
      setAllRoutesData(result.allData);
      setPointsData(result.locations);
    }
  }, [state]);

  // Update sidebar data when routesData, startingPoint, or pointsData change
  useEffect(() => {
    if (filteredRoutesData && startingPoint && pointsData.length > 0) {
      const updatedSidebarData = filteredRoutesData.map(({ day, routes }) => {
        const locations = Array.from(
          new Set(
            routes.flatMap(({ start, end }) => [start, end]) // Get unique locations
          )
        )
          .map((locationName) => {
            const location = pointsData.find((point) => point.name === locationName);
            const routeAggTime = routes
              .filter(({ end }) => end === locationName)
              .reduce((totalTime, { aggTime }) => totalTime + (aggTime || 0), 0);

            return location
              ? { name: location.name, time: location.time, aggTime: routeAggTime }
              : null;
          })
          .filter(
            (location) =>
              location && location.name !== startingPoint // Exclude starting point
          );

        return { day, locations };
      });

      setSidebarData(updatedSidebarData);
    }
  }, [filteredRoutesData, startingPoint, pointsData]);
  const adjustRoutesInSameDay = (day, sidebarDataIndex) => {
    const newRoute = [startingPoint,...sidebarData[sidebarDataIndex].locations.map((location) => location.name), startingPoint];
    const pairs = newRoute.map((location, index) => [location, newRoute[index + 1]]);
    const newRoutes = [];
    pairs.forEach((pair) => {
      const route = allRoutesData.find(
        (route) =>
          route.start === pair[0] && route.end === pair[1]
      );
      if (route) {
        newRoutes.push(route);
      }
    });
    const filteredRoutesIndex = filteredRoutesData.findIndex((item) => item.day === day);
    const updatedFilteredRoutesData = [...filteredRoutesData];
    updatedFilteredRoutesData[filteredRoutesIndex].routes = newRoutes;
    setFilteredRoutesData(updatedFilteredRoutesData);
    console.log(updatedFilteredRoutesData);
  };

  const moveRoute = (draggedDay, draggedRouteIndex, droppedDay, droppedRouteIndex) => {
    const updatedSidebarData = [...sidebarData];
    const draggedDayIndex = updatedSidebarData.findIndex((item) => item.day === draggedDay);
    const droppedDayIndex = updatedSidebarData.findIndex((item) => item.day === droppedDay);
    if (draggedDayIndex === -1 || droppedDayIndex === -1) return; 
    const draggedRoute = updatedSidebarData[draggedDayIndex].locations.splice(draggedRouteIndex, 1)[0];
    updatedSidebarData[droppedDayIndex].locations.splice(droppedRouteIndex, 0, draggedRoute);
    setSidebarData(updatedSidebarData);
    if(draggedDay === droppedDay){
      adjustRoutesInSameDay(draggedDay,draggedDayIndex);
    }
    else{
      adjustRoutesInSameDay(draggedDay, draggedDayIndex);
      adjustRoutesInSameDay(droppedDay, droppedDayIndex);
    }
  };
  

  // Render points for visible routes on the map
  const renderMarkers = () => {
    return pointsData
      .filter((point) => {
        const isPartOfVisibleRoute = filteredRoutesData.some(
          (dayData) =>
            visibleRoutes[dayData.day] !== false &&
            dayData.routes.some(
              (route) =>
                route.start === point.name || route.end === point.name
            )
        );
        return isPartOfVisibleRoute;
      })
      .map((point, index) => (
        <Marker key={index} position={[point.lat, point.lng]} icon={firstMarkerIcon}>
          <Popup>{point.name}</Popup>
        </Marker>
      ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="map-container">
        <MapContainer
          center={[50.0539, 19.8976]} // Center for the map
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Render Routes */}
          {filteredRoutesData.map((dayData, dayIndex) => {
            const { day, routes } = dayData;
            if (visibleRoutes[day] !== false) {
              return (
                <div key={`day-${dayIndex}`}>
                  <h4>{day}</h4>
                  {routes.map((route, routeIndex) =>
                    route.path && route.path.length > 0
                      ? route.path.map((segment, segmentIndex) => {
                          if (
                            segment.geoJSON &&
                            segment.geoJSON.coordinates &&
                            segment.geoJSON.coordinates.length > 0
                          ) {
                            const coordinates = segment.geoJSON.coordinates.map(
                              ([lon, lat]) => [lat, lon]
                            );
                            const pathColor = dayColors[day] || "gray";
                            return (
                              <Polyline
                                key={`route-${dayIndex}-route-${routeIndex}-segment-${segmentIndex}`}
                                positions={coordinates}
                                color={pathColor}
                                weight={4}
                              />
                            );
                          }
                          return null;
                        })
                      : null
                  )}
                </div>
              );
            }
            return null;
          })}

          {/* Render Markers */}
          {renderMarkers()}
        </MapContainer>
      </div>

      {/* Sidebar for route and day visibility */}
      <PathSidebar
        routesData={sidebarData}
        moveRoute={moveRoute}
        setVisibleRoutes={setVisibleRoutes}
        visibleRoutes={visibleRoutes}
      />
    </DndProvider>
  );
};

export default RouteMapSection;
