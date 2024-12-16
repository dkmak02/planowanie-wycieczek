var express = require('express');
var pathController = require('./../controllers/pathController')
var router = express.Router();

router.post('/', pathController.getPaths);
router.post('/bestCombination', pathController.getBestPathForDay);
// create simple test endpoint
router.get('/test', (req, res) => {
    res.send('Hello World!')
})
module.exports = router;