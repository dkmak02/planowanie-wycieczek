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
 *                         type: object
 *                         properties:
 *                           area:
 *                             type: number
 *                             example: 14.24341856985759
 *                           circuit:
 *                             type: number
 *                             example: 13.266
 *                           paths:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 start:
 *                                   type: string
 *                                   example: 1
 *                                 end:
 *                                   type: string
 *                                   example: 2
 *                                 aggTime:
 *                                   type: number
 *                                   example: 0.081818
 *                                 path:
 *                                   type: object
 *                                   properties:
 *                                     agg_cost:
 *                                       type: number
 *                                       example: 0.081818
 *                                     geom_way:
 *                                       type: string
 *                                     geoJSON:
 *                                       type: object
 *                                       properties:
 *                                         coordinates:
 *                                           type: array
 *                                           items:
 *                                             type: array
 *                                             items:
 *                                               type: number
 *                           totalHours:
 *                             type: number
 *                             example: 7
 *                 locations:
 *                   type: array
 *                   description: List of all input locations with additional data.
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Opole
 *                       lat:
 *                         type: number
 *                         example: 50.678792900000005
 *                       lng:
 *                         type: number
 *                         example: 17.929884436033525
 *                       time:
 *                         type: number
 *                         example: 30
 *                       isStartingPoint:
 *                         type: boolean
 *                         example: true
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
 *                         type: object
 *                         properties:
 *                           area:
 *                             type: number
 *                             example: 14.24341856985759
 *                           circuit:
 *                             type: number
 *                             example: 13.266
 *                           paths:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 start:
 *                                   type: string
 *                                   example: 1
 *                                 end:
 *                                   type: string
 *                                   example: 2
 *                                 aggTime:
 *                                   type: number
 *                                   example: 0.081818
 *                                 path:
 *                                   type: object
 *                                   properties:
 *                                     agg_cost:
 *                                       type: number
 *                                       example: 0.081818
 *                                     geom_way:
 *                                       type: string
 *                                     geoJSON:
 *                                       type: object
 *                                       properties:
 *                                         coordinates:
 *                                           type: array
 *                                           items:
 *                                             type: array
 *                                             items:
 *                                               type: number
 *                           totalHours:
 *                             type: number
 *                             example: 7
 *       400:
 *         description: Invalid input data.
 */
router.post('/bestCombination', pathController.getBestPathForDay);
router.post('/add-new-marker', pathController.addNewMarker);
module.exports = router;
