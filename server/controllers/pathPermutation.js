var db = require('./../dbConn');
const geolib = require('geolib');
const createOrderedPairs = (circlePath) => {
    const pairs = [];

    for (let i = 0; i < circlePath.length - 1; i++) {
        const first = circlePath[i];
        const second = circlePath[i + 1];
        pairs.push([first, second]);
    }

    return pairs;
};

const filterPathsByOrderedPairs = (data, orderPairs) => {
    const filteredPaths = [];

    for (let i = 0; i < orderPairs.length; i++) {
        const [start, end] = orderPairs[i];
        const matchingPaths = data.filter((path) => path.start === start && path.end === end);

        if (matchingPaths.length > 0) {
            // Find the path with the highest agg_cost
            // Calculate aggTime from the maximum agg_cost path
            const aggTime = matchingPaths[0].path[matchingPaths[0].path.length - 1].agg_cost;
            // Push the result with additional aggTime
            filteredPaths.push({
                start,
                end,
                path: matchingPaths[0].path,
                aggTime,
            });
        }
    }

    return filteredPaths;
};

const generatePlansWithConstraints = async (data, startPoint, maxHours, maxDays, markers) => {
    const allPoints = Array.from(new Set(data.map((item) => item.start).concat(data.map((item) => item.end))));
    const remainingPoints = allPoints.filter((point) => point !== startPoint);

    const results = [];
    const currentPlan = Array.from({ length: maxDays }, () => ({ locations: [], totalHours: 0 }));

    const backtrack = (pointsLeft, dayIndex) => {
        if (pointsLeft.length === 0) {
            results.push(JSON.parse(JSON.stringify(currentPlan)));
            return;
        }

        if (dayIndex >= maxDays) return;

        for (let i = 0; i < pointsLeft.length; i++) {
            const point = pointsLeft[i];
            const prevLocation = currentPlan[dayIndex].locations.slice(-1)[0] || startPoint;

            const matchingPath = data.find(
                (path) => path.start === prevLocation && path.end === point
            );

            if (matchingPath) {
                const aggTime = matchingPath.aggTime
                const visitTime = matchingPath.visitTime || 0
                if (currentPlan[dayIndex].totalHours + aggTime + visitTime <= maxHours) {
                    currentPlan[dayIndex].locations.push(point);
                    currentPlan[dayIndex].totalHours += aggTime + visitTime;

                    // Recurse to the next location
                    backtrack(
                        pointsLeft.filter((_, idx) => idx !== i),
                        dayIndex
                    );

                    // Backtrack: Undo changes to the current plan
                    currentPlan[dayIndex].locations.pop();
                    currentPlan[dayIndex].totalHours -= aggTime + visitTime;
                }
            }
        }

        // Try moving to the next day
        if (currentPlan[dayIndex].locations.length > 0) {
            const circularPath = [startPoint, ...currentPlan[dayIndex].locations, startPoint];
            const circularHours = calculateCircularPathHours(data, circularPath);

            if (currentPlan[dayIndex].totalHours + circularHours <= maxHours) {
                currentPlan[dayIndex].totalHours += circularHours;

                backtrack(pointsLeft, dayIndex + 1);

                currentPlan[dayIndex].totalHours -= circularHours;
            }
        }
    };

    backtrack(remainingPoints, 0);

    const removeEmptySubArrays = (nestedResults) => {
        return nestedResults.filter((subArray) =>
            subArray.every((result) => result.locations && result.locations.length > 1)
        );
    };

    const filteredResults = removeEmptySubArrays(results);
    const additionalResults = await Promise.all(
        filteredResults.map((plan) => generateItineraryFromPlan(data, plan, startPoint, markers))
    );

    const sortedResults = additionalResults.sort((a, b) => {
        const getAverageRatio = (result) => {
            const days = Object.keys(result);
                    const totalRatio = days.reduce((sum, day) => {
                const { area, circuit } = result[day];
                if (circuit > 0) { 
                    sum += area / circuit;
                }
                return sum;
            }, 0);
    
            return totalRatio / days.length; 
        };
    
        const ratioA = getAverageRatio(a);
        const ratioB = getAverageRatio(b);
    
        return ratioA - ratioB;
    });
    const bestResults = sortedResults.slice(0, Math.ceil(sortedResults.length * 0.25));
    bestResults.sort((a, b) => {
        const getAverageHours = (result) => {
            const days = Object.keys(result);
            const totalHours = days.reduce((sum, day) => {
                sum += result[day].totalHours;
                return sum;
            }, 0);
            return totalHours / days.length;
        };
        const hoursA = getAverageHours(a);
        const hoursB = getAverageHours(b);
        return hoursA - hoursB;
    }
    );
    return bestResults[0];
};
const calculateCircularPathHours = (data, circularPath) => {
    const orderedPairs = createOrderedPairs(circularPath);
    let totalHours = 0;

    orderedPairs.forEach(([start, end]) => {
        const matchingPath = data.find((path) => path.start === start && path.end === end);
        totalHours += matchingPath.aggTime;
    });

    return totalHours;
};

const calculateArea = (circularPath, markers) => {
    const points = markers
        .filter((marker) => circularPath.has(marker.name))
        .map((marker) => ([marker.lat, marker.lng]));
    return geolib.getAreaOfPolygon(points)/(1000*1000);
};
const calculateCircuit = (circularPath, markers) => {
    const points = markers
        .filter((marker) => circularPath.includes(marker.name))
        .map((marker) => ({"latitude":marker.lat, "longitude":marker.lng}));
    points.push(points[0]);
    let circuit = 0;
    for(let i = 0; i < points.length - 1; i++){
        circuit += geolib.getDistance(points[i], points[i+1]);
    }
    return circuit/1000;
}
const generateItineraryFromPlan = async (data, plan, startPoint, markers) => {
    const itinerary = {};

    for (const [index, day] of plan.entries()) {
        const dayName = `day${index + 1}`;
        const closedCirclePath = [startPoint, ...day.locations, startPoint];
        const orderedPairs = createOrderedPairs(closedCirclePath);
        
        const area = calculateArea(new Set(closedCirclePath), markers);
        const circuit = calculateCircuit(closedCirclePath, markers);


        const filteredPaths = filterPathsByOrderedPairs(data, orderedPairs);

        itinerary[dayName] = [{
            paths: filteredPaths,
            totalHours: day.totalHours,
            area, 
            circuit}
        ];
    }

    return itinerary;
};

exports.generatePlansWithConstraints = async (apiData, startingPoint, maxHours, maxDays, markers) => {
    return generatePlansWithConstraints(apiData, startingPoint, maxHours, maxDays, markers);
};
