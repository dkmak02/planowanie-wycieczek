/**
 * @swagger
 * tags:
 *   name: Paths
 *   description: API for managing and calculating paths
 */

var express = require('express');
var pathController = require('./../controllers/pathController');
var router = express.Router();

/**
 * @swagger
 * /paths:
 *   post:
 *     summary: Calculate all possible paths based on markers
 *     tags: [Paths]
 *     description: This endpoint calculates possible routes for the given markers, considering time constraints.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               markers:
 *                 type: array
 *                 description: List of markers (points of interest) with coordinates, visit times, and starting point status.
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the marker.
 *                       example: Opole
 *                     lat:
 *                       type: number
 *                       description: Latitude of the marker.
 *                       example: 50.678792900000005
 *                     lng:
 *                       type: number
 *                       description: Longitude of the marker.
 *                       example: 17.929884436033525
 *                     time:
 *                       type: number
 *                       description: Visit time in minutes at the marker.
 *                       example: 30
 *                     isStartingPoint:
 *                       type: boolean
 *                       description: Indicates whether this marker is the starting point.
 *                       example: true
 *               maxHours:
 *                 type: number
 *                 description: Maximum hours available per day for travel and visiting.
 *                 example: 7
 *               maxDays:
 *                 type: number
 *                 description: Maximum number of days for the trip.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Successfully calculated all possible paths.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allData:
 *                   type: array
 *                   description: Array of all paths between markers.
 *                   items:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         example: Opole
 *                       end:
 *                         type: string
 *                         example: 1
 *                       path:
 *                         type: array
 *                         description: List of path points.
 *                         items:
 *                           type: object
 *                           properties:
 *                             agg_cost:
 *                               type: number
 *                               example: 0.081818
 *                             geom_way:
 *                               type: string
 *                               description: Geometry data.
 *                             geoJSON:
 *                               type: object
 *                               properties:
 *                                 coordinates:
 *                                   type: array
 *                                   items:
 *                                     type: array
 *                                     items:
 *                                       type: number
 *                       aggTime:
 *                         type: number
 *                         example: 0.081818
 *                       visitTime:
 *                         type: number
 *                         example: 0.5
 *                 filteredData:
 *                   type: object
 *                   description: Filtered paths grouped by days.
 *                   properties:
 *                     day1:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: [ "Opole", "3","Opole" ]
 *                     day2:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: [ "Opole", "1","Opole" ]
 *       400:
 *         description: Invalid input data.
 */
router.post('/', pathController.getPaths);

/**
 * @swagger
 * /paths/bestCombination:
 *   post:
 *     summary: Get the best path combination for a single day
 *     tags: [Paths]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               markers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Opole
 *                     lat:
 *                       type: number
 *                       example: 50.678792900000005
 *                     lng:
 *                       type: number
 *                       example: 17.929884436033525
 *                     time:
 *                       type: number
 *                       example: 30
 *                     isStartingPoint:
 *                       type: boolean
 *                       example: true
 *               maxHours:
 *                 type: number
 *                 example: 24
 *               maxDays:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully calculated the best path for a single day.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filteredData:
 *                   type: object
 *                   description: Filtered paths grouped by days.
 *                   properties:
 *                     day1:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: [ "Opole", "3","Opole" ]
 *                     day2:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: [ "Opole", "1","Opole" ]
 *       400:
 *         description: Invalid input data.
 */
router.post('/bestCombination', pathController.getBestPathForDay);
/**
 * @swagger
 * /paths/add-new-marker:
 *   post:
 *     summary: Add a new marker
 *     tags: [Paths]
 *     description: Adds a new marker and recalculates paths.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newMarker:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the new marker.
 *                     example: NewMarker
 *                   lat:
 *                     type: number
 *                     description: Latitude of the new marker.
 *                     example: 50.123456
 *                   lng:
 *                     type: number
 *                     description: Longitude of the new marker.
 *                     example: 17.654321
 *                   time:
 *                     type: number
 *                     description: Visit time at the new marker in minutes.
 *                     example: 40
 *                   isStartingPoint:
 *                     type: boolean
 *                     description: Indicates if the new marker is the starting point.
 *                     example: false
 *               markers:
 *                 type: array
 *                 description: List of existing markers.
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: ExistingMarker
 *                     lat:
 *                       type: number
 *                       example: 50.678792900000005
 *                     lng:
 *                       type: number
 *                       example: 17.929884436033525
 *                     time:
 *                       type: number
 *                       example: 30
 *                     isStartingPoint:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       200:
 *         description: Successfully added new marker and recalculated paths.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newPaths:
 *                   type: array
 *                   description: Updated paths including the new marker.
 *                   items:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         example: ExistingMarker
 *                       end:
 *                         type: string
 *                         example: NewMarker
 *                       path:
 *                         type: array
 *                         description: The calculated path data.
 *                         items:
 *                           type: object
 *                           properties:
 *                             agg_cost:
 *                               type: number
 *                               example: 0.12345
 *                             geoJSON:
 *                               type: object
 *                               description: GeoJSON geometry data.
 *       400:
 *         description: Invalid input data.
 */
router.post('/add-new-marker', pathController.addNewMarker);
router.post('/testAlgorithm', pathController.testAlgorithms);
module.exports = router;
