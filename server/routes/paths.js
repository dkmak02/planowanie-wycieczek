var express = require('express');
var pathController = require('./../controllers/pathController')
var router = express.Router();

router.post('/', pathController.getPaths);

module.exports = router;