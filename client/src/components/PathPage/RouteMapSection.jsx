import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { DndProvider } from "react-dnd";
import { data, useLocation } from "react-router-dom";
import { HTML5Backend } from "react-dnd-html5-backend";
import PathSidebar from "./PathSidebar";
import "leaflet/dist/leaflet.css";
import "./RouteMapSection.css";
import Loading from "./../util/Loading";

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

const RouteMapSection = ({ setRouteData }) => {
  const { state } = useLocation();
  const [startingPoint, setStartingPoint] = useState(null);
  const [filteredRoutesData, setFilteredRoutesData] = useState([]); // Initialize as an array
  const [allRoutesData, setAllRoutesData] = useState([]);
  const [pointsData, setPointsData] = useState([]);
  const [visibleRoutes, setVisibleRoutes] = useState({});
  const [sidebarData, setSidebarData] = useState([]);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(null);

  useEffect(() => {
    if (state && state.result) {
      const { result } = state;
      console.log(result)
      const filteredDataArray = Object.entries(result.filteredData).map(([day, dayData]) => {

        return {
            day,
            routes: dayData[0].paths, 
            totalHours: dayData[0].totalHours,
            area: dayData[0].area,
            circuit: dayData[0].circuit,
        };
    });
      const startingLocation = result.locations.find((location) => location.isStartingPoint);
      setStartingPoint(startingLocation);
      setFilteredRoutesData(filteredDataArray);
      setAllRoutesData(result.allData);
      setPointsData(result.locations);
      setRouteData(result);
      setPosition([startingLocation.lat, startingLocation.lng]);
    }
  }, [state]);

  useEffect(() => {
    if (filteredRoutesData && startingPoint && pointsData.length > 0) {
      const updatedSidebarData = filteredRoutesData.map(({ day, routes, area, circuit }) => {
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
              location && location.name !== startingPoint.name // Exclude starting point
          );
        return { day, locations, area, circuit }; // Include area and circuit
      });

      setSidebarData(updatedSidebarData);
      console.log(updatedSidebarData)
      setRouteData((prevData) => {
        const transformedData = filteredRoutesData.reduce((acc, { day, routes, area, circuit }) => {
          acc[day] = { paths: routes, area, circuit }; // Include area and circuit in transformed data
          return acc;
        }, {});

        return {
          ...prevData,
          filteredData: transformedData,
        };
      });
    }
  }, [filteredRoutesData, startingPoint, pointsData]);
  const adjustRoutesInSameDay = (day, sidebarDataIndex) => {
    const newRoute = [startingPoint.name,...sidebarData[sidebarDataIndex].locations.map((location) => location.name), startingPoint.name];
    const pairs = newRoute.map((location, index) => [location, newRoute[index + 1]]);
    const newRoutes = [];
    pairs.forEach((pair) => {
      const route = allRoutesData.find(
        (route) =>
          route.start === pair[0] && route.end === pair[1]
      );
      if (route) {
        route.aggTime =route.path[route.path.length - 1].agg_cost
        newRoutes.push(route);
      }
    });
    const filteredRoutesIndex = filteredRoutesData.findIndex((item) => item.day === day);
    const updatedFilteredRoutesData = [...filteredRoutesData];
    console.log(newRoutes)
    updatedFilteredRoutesData[filteredRoutesIndex].routes = newRoutes;
    setFilteredRoutesData(updatedFilteredRoutesData);
  };
  const adjustRoutesInDiffrentDay = (day, data) => {
    const filteredRoutesIndex = filteredRoutesData.findIndex((item) => item.day === day);
    const updatedFilteredRoutesData = [...filteredRoutesData];
    updatedFilteredRoutesData[filteredRoutesIndex].routes = data;
    setFilteredRoutesData(updatedFilteredRoutesData);
    console.log(data);
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
  
      const result = await response.json();
      result.data.filteredData.day1[0].paths.forEach((path) => {
        path.visitTime = (pointsData.find((point) => point.name === path.end).time || 0) / 60;
      });
      return result.data.filteredData.day1[0].paths;
    } catch (error) {
      console.error('Error sending markers to server:', error);
      return []; 
    }
  };
  const moveRoute = async (draggedDay, draggedRouteIndex, droppedDay, droppedRouteIndex) => {
    setPosition(map.getCenter());
    setZoom(map.getZoom());
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
        const day1DataLocations = [pointsData.find((point) => point.name === startingPoint.name)];
        const day2DataLocations = [pointsData.find((point) => point.name === startingPoint.name)];

        sidebarData[draggedDayIndex].locations.forEach((location) => {
          day1DataLocations.push(pointsData.find((point) => point.name === location.name));
        });
        sidebarData[droppedDayIndex].locations.forEach((location) => {
          day2DataLocations.push(pointsData.find((point) => point.name === location.name));
        });

        const day1Request = {
          markers: day1DataLocations,
          maxHours: 24,
          maxDays: 1,
        };
        const day2Request = {
          markers: day2DataLocations,
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
  

  const renderMarkers = () => {
    return pointsData
      .filter((point) => {
        const isPartOfVisibleRoute = filteredRoutesData.some(
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

  return loading ? (
    <Loading />
  ) : (
    <DndProvider backend={HTML5Backend}>
      <div className="map-container">
        <MapContainer
          center={position}
          zoom={zoom || 13}
          style={{ height: "100%", width: "100%" }}
          ref={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {filteredRoutesData.map((dayData, dayIndex) => {
            const { day, routes, area, circuit } = dayData;
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

          {renderMarkers()}
        </MapContainer>
      </div>

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
