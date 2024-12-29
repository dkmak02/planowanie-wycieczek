const { shuffle } = require("lodash");
const geolib = require('geolib');

const generateInitialPopulation = (points, populationSize, days, startPoint) => {
    const population = Array.from({ length: populationSize }, () => shuffle(points));
    population.forEach((route) => {
        route.unshift(startPoint);
        route.push(startPoint);
    });

    for (let i = 0; i < days - 1; i++) {
        population.forEach((route) => {
            let index;
            do {
                index = Math.floor(Math.random() * (route.length - 1)) + 1; 
            } while (
                route[index - 1] === startPoint || 
                route[index] === startPoint || 
                route[index + 1] === startPoint
            );
            route.splice(index, 0, startPoint); 
        });
    }

    return population;
};


const calculateArea = (coordinates) => {
    const polygon = coordinates.map(coord => ({ latitude: coord[1], longitude: coord[0] }));

    const areaInSquareMeters = geolib.getAreaOfPolygon(polygon);
    const areaInSquareKilometers = areaInSquareMeters / 1e6;
    return areaInSquareKilometers;
}
const calculateCircuit = (coordinates) => {
    const polygon = coordinates.map(coord => ({ latitude: coord[1], longitude: coord[0] }));
    let circuit = 0;
    for (let i = 0; i < polygon.length - 1; i++) {
        circuit += geolib.getDistance(polygon[i], polygon[i + 1]);
    }
    const circuitInKilometers = circuit / 1000;
    return circuitInKilometers;
};
const createDaysInRoute = (route, startPoint) => {
    const daysInRoute = [];
    let currentDay = [];

    for (let i = 0; i < route.length; i++) {
        const point = route[i];

        currentDay.push(point);

        if (point === startPoint && currentDay.length > 1) {
            daysInRoute.push([...currentDay]); 
            currentDay = [startPoint]; 
        }
    }

    return daysInRoute;
};


const calculateFitness = (route, data, startPoint, maxHours, days) => {
    const daysInRoute = createDaysInRoute(route, startPoint);
    if (daysInRoute.length !== days) {
        return -1000;
    }

    let totalFitness = 0;
    const dayTimes = [];
    for (let routes of daysInRoute) {
        if (routes.length < 3) {
            return -1000; 
        }

        const allCoordinates = [];
        let dayHours = 0;

        for (let i = 0; i < routes.length - 1; i++) {
            const start = routes[i];
            const end = routes[i + 1];
            const path = data.find((item) => item.start === start && item.end === end);
            if (!path) {
                return 0; 
            }
            allCoordinates.push(path.path[0].geoJSON.coordinates);
            dayHours += path.aggTime;
        }

        dayTimes.push(dayHours);


        const area = calculateArea(allCoordinates.flat());
        const circuit = calculateCircuit(allCoordinates.flat());

        const areaCircuitScore = area / circuit;
        totalFitness += areaCircuitScore * 1.2;
    }
    const avgTime = dayTimes.reduce((a, b) => a + b, 0) / dayTimes.length;
    const timeVariance = dayTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / dayTimes.length;
    const balanceScore = 1 / (1 + timeVariance); 

    totalFitness += balanceScore * 5; 

    return totalFitness;
};


const selectParents = (population, fitnessScores) => {
    const validIndividuals = population.filter((_, index) => fitnessScores[index] > 0);
    const validFitnessScores = fitnessScores.filter(score => score > 0);

    if (validIndividuals.length === 0) {
        throw new Error("No valid individuals with positive fitness scores.");
    }
    const totalFitness = validFitnessScores.reduce((acc, score) => acc + score, 0);
    const probabilities = validFitnessScores.map(score => score / totalFitness);

    const selectOne = () => {
        const rand = Math.random();
        let sum = 0;

        for (let i = 0; i < probabilities.length; i++) {
            sum += probabilities[i];
            if (rand <= sum) {
                return validIndividuals[i];
            }
        }
        return validIndividuals[validIndividuals.length - 1];
    };

    const parent1 = selectOne();
    let parent2 = selectOne();

    while (parent2 === parent1) {
        parent2 = selectOne();
    }

    return [parent1, parent2];
};
const crossover = (parent1, parent2) => {
    const parent1Days = createDaysInRoute(parent1, parent1[0]);
    const parent2Days = createDaysInRoute(parent2, parent2[0]);

    const randomDay = Math.floor(Math.random() * parent1Days.length);
    const child1 = [...parent1Days[randomDay]];
    const child2 = [...parent2Days[randomDay]]; 

    child1.splice(0, 1);
    child1.splice(-1, 1);
    child2.splice(0, 1);
    child2.splice(-1, 1);
    for (let i = 0; i < child2.length; i++) {
        if (!child1.includes(child2[i])) {
            child1.push(child2[i]);
        }
    }


    const updatedParent2Days = parent2Days.map((day) =>
        day.filter((point) => !child1.includes(point))
    );

    child1.unshift(parent1[0]);
    child1.push(parent1[0]);

    updatedParent2Days[randomDay] = child1;

    const result = updatedParent2Days.flat();
    for (let i = 0; i < result.length - 1; i++) {
        if (result[i] === result[i + 1]) {
            result.splice(i, 1);
            i--;
        }
    }
    return result;
};


const mutate = (route, mutationRate) => {
    if (Math.random() < mutationRate) {
        const index1 = Math.floor(Math.random() * route.length);
        const index2 = Math.floor(Math.random() * route.length);

        [route[index1], route[index2]] = [route[index2], route[index1]];
    }
    return route;
};
const generatePathsFromRoute = (route) => {
    const paths = [];
    for (let i = 0; i < route.length - 1; i++) {
        paths.push([route[i], route[i + 1]]);
    }
    return paths;
};
const createPropereObject = (route) => {
    const daysInRoute = createDaysInRoute(route, route[0]);
    const result = {};
    for(let i = 0; i < daysInRoute.length; i++){
        result[`day${i+1}`] = generatePathsFromRoute(daysInRoute[i]);
    }
    return result;
}
const geneticAlgorithm = async (data, startPoint, populationSize, generations, mutationRate, maxHours, days) => {
    const points = Array.from(new Set(data.flatMap((item) => [item.start, item.end]))).filter((point) => point !== startPoint);
    const population = generateInitialPopulation(points, populationSize, days, startPoint);

    for (let gen = 0; gen < generations; gen++) {
        const fitnessScores = population.map((route) => calculateFitness([...route], data, startPoint, maxHours, days));
        const newPopulation = [];
        for (let i = 0; i < populationSize; i++) {
            const [parent1, parent2] = selectParents(population, fitnessScores);
            let child = crossover(parent1, parent2);
            child = mutate(child, mutationRate);
            newPopulation.push(child);
        }
        population.length = 0;
        population.push(...newPopulation);
    }

    const fitnessScores = population.map((route) => calculateFitness(route, data, startPoint, maxHours, days));
    const bestIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
    return createPropereObject(population[bestIndex]);
};

exports.geneticAlgorithm = geneticAlgorithm;