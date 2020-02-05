var express = require('express');
const path = require("path");  
var router = express.Router();

//Default path call serves index.ejs
router.get('/', function (request, response) {
    response.render(path.join(__dirname, '../views/index.ejs'));
});

module.exports = router