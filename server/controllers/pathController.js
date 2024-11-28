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
        'A1': {'lat': 50.0539425618025, 'lon': 19.89761352539063},
        'A2': {'lat': 50.04534479133112, 'lon': 19.933147430419925},
        'A3': {'lat': 50.058902113365576, 'lon': 19.970054626464847},
        'A4': {'lat': 50.070913124679485, 'lon': 19.92404937744141}
    };
    try {
        paths = await getPathsCombinations(input)
        filteredPaths = filterApiData(paths)
        res.status(200).json({
            status: 'success',
            data: filteredPaths,
        });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({
            status: 'fail',
            message: 'Error executing query',
        });
    }

};