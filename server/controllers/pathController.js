var db = require('./../dbConn');
const { generatePlansWithConstraints } = require('./pathPermutation');
const { decodeAllData } = require('./convertGeom');
const fs = require('fs');

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
        const filteredPaths = await generatePlansWithConstraints(decodedPaths, startingPoint, maxHours, maxDays, markers);
        const data = {
            locations: markers,
            filteredData: filteredPaths,
            allData: decodedPaths,
        };
        res.status(200).json({
            status: 'success',
            data,
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
      const { markers, maxHours, maxDays } = req.body;
      const paths = await getPathsCombinations(markers);
      const decodedPaths = await decodeAllData(paths);
      const startingPoint = await findStartingPoint(markers);
      const filteredPaths = await generatePlansWithConstraints(decodedPaths, startingPoint, maxHours, maxDays, markers);

      const data = {
          filteredData: filteredPaths,
      };

      res.status(200).json({
          status: 'success',
          data,
      });
  } catch (error) {
      console.error('Error executing query', error.stack);
      res.status(500).json({
          status: 'fail',
          message: 'Error executing query',
      });
  }
};
