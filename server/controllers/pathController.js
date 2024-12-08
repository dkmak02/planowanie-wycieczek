var db = require('./../dbConn');
const {filterApiData} = require('./pathPermutation')
const {decodeAllData} = require('./convertGeom')
const fs = require('fs');
const getPathsCombinations = async(input) => {
    const results = [];
    const inputArray = Object.keys(input);
        for (let i = 0; i < inputArray.length; i++) {
            for (let j = 0; j < inputArray.length; j++) {
              if (i !== j) {
                const startLat = input[i].lat;
                const startLon = input[i].lng;
                const endLat = input[j].lat;
                const endLon = input[j].lng;
                const result = await db.query(
                  "SELECT * FROM find_shortest_path2($1, $2, $3, $4)",
                  [startLat, startLon, endLat, endLon]
                );
                results.push({
                  start: input[i].name,
                  end: input[j].name,
                  path: result,
                });
              }
            }
        }
    return results
}
const findStartingPoint = async(input) => {
    const startingPoint = input.filter((item) => item.isStartingPoint === true);
    return startingPoint[0].name;
}
exports.getPaths = async (req, res, next) => {
    
    try {
        startingPoint = await findStartingPoint(req.body)
        console.log(startingPoint)
        paths = await getPathsCombinations(req.body)
        decodedPaths = await decodeAllData(paths)
        filteredPaths = filterApiData(decodedPaths, startingPoint)
        const data = {
            locations: req.body,
            filteredData: filteredPaths,
            allData: decodedPaths,
        };

        fs.writeFileSync('./filteredData.json', JSON.stringify(data, null, 2));
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({
            status: 'fail',
            message: 'Error executing query',
        });
    }

};