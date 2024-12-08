const fs = require('fs');
const path = require('path');

const loadInputFromFile = () => {
    try {
        const filePath = path.join(__dirname, './../data.json');
        console.log(filePath);
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Error reading or parsing the file:', error.message);
        return null;
    }
};

const createDaysWithLimitedLocations = (data, startPoint) => {
    const pointsSet = new Set();
    data.forEach(item => {
        pointsSet.add(item.start);
        pointsSet.add(item.end);
    });

    const points = Array.from(pointsSet);
    const remainingPoints = points.filter(point => point !== startPoint);

    // Shuffle the remaining points randomly
    for (let i = remainingPoints.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingPoints[i], remainingPoints[j]] = [remainingPoints[j], remainingPoints[i]];
    }

    // Create days with a maximum of 3 locations per day
    const days = [];
    while (remainingPoints.length > 0) {
        days.push(remainingPoints.splice(0, 3)); // Take up to 3 points per day
    }

    return days;
};

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
        const matchingPath = data.filter((path) => path.start === start && path.end === end);
        if (matchingPath.length > 0) {
            console.log(matchingPath);
            const aggTime = matchingPath[0].path[matchingPath[0].path.length - 1].agg_cost;
            filteredPaths.push({
                start,
                end,
                path: matchingPath[0].path,
                aggTime,
            });
        }
    }

    return filteredPaths;
};

const generateItinerary = (data, startPoint) => {
    const daysWithLocations = createDaysWithLimitedLocations(data, startPoint);
    const itinerary = {};

    daysWithLocations.forEach((locations, index) => {
        const dayName = `day${index + 1}`;

        // Ensure circular path for the day by adding startPoint at the beginning and end
        const closedCirclePath = [startPoint, ...locations, startPoint];

        // Create ordered pairs for the circular path
        const orderedPairs = createOrderedPairs(closedCirclePath);

        // Filter the paths based on the ordered pairs
        const filteredPaths = filterPathsByOrderedPairs(data, orderedPairs);

        itinerary[dayName] = filteredPaths;
    });

    return itinerary;
};

// Example Usage
// const data = loadInputFromFile();
// const itinerary = generateItinerary(data, 'Iwanowice');
// console.log(itinerary);


exports.filterApiData = (apiData, startingPoint) =>{
    return generateItinerary(apiData, startingPoint);
}


