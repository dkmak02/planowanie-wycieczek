var db = require('./../dbConn');
const { decodeAllData } = require('./convertGeom');
const lz = require('lz-string');
const {geneticAlgorithm} = require('./geneticAlgorithm');
const getPathsCombinations = async (input) => {
  const results = [];
  const inputArray = Object.keys(input);

  for (let i = 0; i < inputArray.length; i++) {
    for (let j = 0; j < inputArray.length; j++) {
      if (i !== j) {
        const startLat = input[i].lat;
        const startLon = input[i].lng;
        const endLat = input[j].lat;
        const endLon = input[j].lng;

        try {
          const result = await db.query(
            "SELECT * FROM find_shortest_path($1, $2, $3, $4) order by agg_cost",
            [startLat, startLon, endLat, endLon]
          );
          results.push({
            start: input[i].name,
            end: input[j].name,
            path: result,
            aggTime: result[result.length - 1].agg_cost,
            visitTime: (input[j].time || 0)/60,
          });
        } catch (error) {
          console.error('Query failed:', error.message);
          throw error; 
        }
      }
    }
  }
  return results;
};

const findStartingPoint = async (input) => {
    const startingPoint = input.find((item) => item.isStartingPoint === true);
    if (!startingPoint) {
        throw new Error("No starting point defined in input.");
    }
    return startingPoint.name;
};

exports.getPaths = async (req, res, next) => {
    const { markers, maxHours, maxDays } = req.body;
    try {
        const startingPoint = await findStartingPoint(markers);
        const paths = await getPathsCombinations(markers);
        const decodedPaths = await decodeAllData(paths);
        const filteredData = await geneticAlgorithm(decodedPaths,startingPoint, 100, 200,0.1, maxHours, maxDays);
        const data = {
            filteredData: filteredData,
            allData: decodedPaths,
        };
        const compressedData = lz.compressToUTF16(JSON.stringify(data));
        res.status(200).json({
            status: 'success',
            data: compressedData,
        });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({
            status: 'fail',
            message: 'Error executing query',
        });
    }
};
exports.getBestPathForDay = async (req, res, next) => {
  try {
      const { markers, maxHours, maxDays, decodedPaths } = req.body;
      const decompredsedPaths = JSON.parse(lz.decompressFromUTF16(decodedPaths));
      const startingPoint = await findStartingPoint(markers);
      const filteredData = await geneticAlgorithm(decompredsedPaths, startingPoint, 20, 200, 0.1, maxHours, maxDays);

      const data = {
       filteredData: filteredData,
      };
      const compressedData = lz.compressToUTF16(JSON.stringify(data));
      res.status(200).json({
          status: 'success',
          data:compressedData,
      });
  } catch (error) {
      console.error('Error executing query', error.stack);
      res.status(500).json({
          status: 'fail',
          message: 'Error executing query',
      });
  }
};
exports.addNewMarker = async (req, res, next) => {
    const { newMarker, markers} = req.body;
    let startLat = newMarker.lat;
    let startLon = newMarker.lng;
    const results = [];
    try {
      for (let i = 0; i < markers.length; i++) {
          let endLat = markers[i].lat;
          let endLon = markers[i].lng;


          const result = await db.query(
            "SELECT * FROM find_shortest_path($1, $2, $3, $4) order by agg_cost",
            [startLat, startLon, endLat, endLon]
          );
          results.push({
            start: newMarker.name,
            end: markers[i].name,
            path: result,
            aggTime: result[result.length - 1].agg_cost,
            visitTime: (markers[i].time || 0)/60,
          });
        }
        endLat = newMarker.lat;
        endLon = newMarker.lng;
        for (let i = 0; i < markers.length; i++) {
          let startLat = markers[i].lat;
          let startLon = markers[i].lng;


          const result = await db.query(
            "SELECT * FROM find_shortest_path($1, $2, $3, $4) order by agg_cost",
            [startLat, startLon, endLat, endLon]
          );
          results.push({
            start: markers[i].name,
            end: newMarker.name,
            path: result,
            aggTime: result[result.length - 1].agg_cost,
            visitTime: (newMarker.time || 0)/60,
          });
        }
        const decodedNewPaths = await decodeAllData(results);
        const compressedData = lz.compressToUTF16(JSON.stringify(decodedNewPaths));
        res.status(200).json({
            status: 'success',
            data: compressedData,
        }); 
    }

    catch (error) {
      console.error('Error executing query', error.stack);
      res.status(500).json({
          status: 'fail',
          message: 'Error executing query',
      });
  }
  }
  const getPathsCombinationsDijsktra = async (input) => {
    const results = [];
    const inputArray = Object.keys(input);
  
    for (let i = 0; i < inputArray.length; i++) {
      for (let j = 0; j < inputArray.length; j++) {
        if (i !== j) {
          const startLat = input[i].lat;
          const startLon = input[i].lng;
          const endLat = input[j].lat;
          const endLon = input[j].lng;
  
          try {
            const result = await db.query(
              "SELECT * FROM find_shortest_path2($1, $2, $3, $4) order by agg_cost",
              [startLat, startLon, endLat, endLon]
            );
            results.push({
              start: input[i].name,
              end: input[j].name,
              path: result,
              aggTime: result[result.length - 1].agg_cost,
              visitTime: (input[j].time || 0)/60,
            });
          } catch (error) {
            console.error('Query failed:', error.message);
            throw error; 
          }
        }
      }
    }
    return results;
  };
  const getPathsCombinationsBdDijsktra = async (input) => {
    const results = [];
    const inputArray = Object.keys(input);
  
    for (let i = 0; i < inputArray.length; i++) {
      for (let j = 0; j < inputArray.length; j++) {
        if (i !== j) {
          const startLat = input[i].lat;
          const startLon = input[i].lng;
          const endLat = input[j].lat;
          const endLon = input[j].lng;
  
          try {
            const result = await db.query(
              "SELECT * FROM find_shortest_path3($1, $2, $3, $4) order by agg_cost",
              [startLat, startLon, endLat, endLon]
            );
            results.push({
              start: input[i].name,
              end: input[j].name,
              path: result,
              aggTime: result[result.length - 1].agg_cost,
              visitTime: (input[j].time || 0)/60,
            });
          } catch (error) {
            console.error('Query failed:', error.message);
            throw error; 
          }
        }
      }
    }
    return results;
  };
  const getPathsCombinationsBdAStar = async (input) => {
    const results = [];
    const inputArray = Object.keys(input);
  
    for (let i = 0; i < inputArray.length; i++) {
      for (let j = 0; j < inputArray.length; j++) {
        if (i !== j) {
          const startLat = input[i].lat;
          const startLon = input[i].lng;
          const endLat = input[j].lat;
          const endLon = input[j].lng;
  
          try {
            const result = await db.query(
              "SELECT * FROM find_shortest_path4($1, $2, $3, $4) order by agg_cost",
              [startLat, startLon, endLat, endLon]
            );
            results.push({
              start: input[i].name,
              end: input[j].name,
              path: result,
              aggTime: result[result.length - 1].agg_cost,
              visitTime: (input[j].time || 0)/60,
            });
          } catch (error) {
            console.error('Query failed:', error.message);
            throw error; 
          }
        }
      }
    }
    return results;
  };
exports.testAlgorithms = async (req, res, next) => {
  const { markers} = req.body;
  const results = [];
  let timerStart = Date.now();
  await getPathsCombinationsDijsktra(markers);
  let timerEnd = Date.now();
  let timer = timerEnd - timerStart;
  results.push({
    paths: 'Dijsktra',
    timer: timer,
  });
  timerStart = Date.now();
  await getPathsCombinationsBdDijsktra(markers);
  timerEnd = Date.now();
  timer = timerEnd - timerStart;
  results.push({
    paths: 'bdDijsktra',
    timer: timer,
  });
  timerStart = Date.now();
  await getPathsCombinations(markers);
  timerEnd = Date.now();
  timer = timerEnd - timerStart;
  results.push({
    paths: 'A*',
    timer: timer,
  });
  timerStart = Date.now();
  await getPathsCombinationsBdAStar(markers);
  timerEnd = Date.now();
  timer = timerEnd - timerStart;
  results.push({
    paths: 'bdA*',
    timer: timer,
  });
  res.status(200).json({
    status: 'success',
    data: results,
  });
}