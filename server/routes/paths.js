var express = require('express');
var pathController = require('./../controllers/pathController')
var router = express.Router();

router.get('/', pathController.getPaths);

module.exports = router;