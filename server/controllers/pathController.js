var db = require('./../dbConn');
const {filterApiData} = require('./pathPermutation')
const getPathsCombinations = async(input) => {
    const results = [];
    const inputArray = Object.keys(input);
        for (let i = 0; i < inputArray.length; i++) {
            for (let j = 0; j < inputArray.length; j++) {
              const startPoint = inputArray[i];
              const endPoint = inputArray[j];
              if (startPoint !== endPoint) {
                const startLat = input[startPoint].lat;
                const startLon = input[startPoint].lon;
                const endLat = input[endPoint].lat;
                const endLon = input[endPoint].lon;
                const result = await db.query(
                  "SELECT * FROM find_shortest_path($1, $2, $3, $4)",
                  [startLat, startLon, endLat, endLon]
                );
                results.push({
                  start: startPoint,
                  end: endPoint,
                  path: result,
                });
              }
            }
        }
    return results
}

exports.getPaths = async (req, res, next) => {
    const input = {
        'raków': {'lat': 50.0619474, 'lon': 19.9368564},
        '1233': {'lat': 50.078074222866334, 'lon': 19.884395599365238},
        '4312': {'lat': 50.0411555759275, 'lon': 19.914436340332035}
    };
    try {
        paths = await getPathsCombinations(input)
        filteredPaths = filterApiData(paths)
        res.status(200).json({
            status: 'success',
            data: {
                locations: input,
                filteredData: filteredPaths,
                allData: paths
            },
        });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({
            status: 'fail',
            message: 'Error executing query',
        });
    }

};