const fs = require('fs');
const path = require('path');

const loadInputFromFile = () => {
    try {
        const filePath = path.join(__dirname, './../dane.json'); 
        const fileContents = fs.readFileSync(filePath, 'utf-8'); 
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Error reading or parsing the file:', error.message);
        return null;
    }
};
const getClosedCirclePathFromData = (data) => {
    console.log(data)
    const pointsSet = new Set();
    data.forEach(item => {
        pointsSet.add(item.start);
        pointsSet.add(item.end);
    });

    const points = Array.from(pointsSet); 
    const startPoint = 'A1';
    const remainingPoints = points.filter(point => point !== startPoint); 
    for (let i = remainingPoints.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingPoints[i], remainingPoints[j]] = [remainingPoints[j], remainingPoints[i]];
    }
    const closedCircle = [startPoint, ...remainingPoints, startPoint];
    return closedCircle;
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
const data = loadInputFromFile();
// const closedCirclePath = getClosedCirclePathFromData(data);
// const orderedPairs = createOrderedPairs(closedCirclePath); 
// const filteredPaths = filterPathsByOrderedPairs(data, orderedPairs);
exports.filterApiData = (apiData) =>{
    const closedCirclePath = getClosedCirclePathFromData(apiData);
    const orderedPairs = createOrderedPairs(closedCirclePath); 
    return filterPathsByOrderedPairs(data, orderedPairs);
}


