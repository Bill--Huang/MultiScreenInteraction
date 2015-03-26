/**
 * Created by huangzebiao on 15-3-19.
 */

var express = require('express');
var router = express.Router();

/* GET Player page. */
router.get('/', function (req, res, next) {
    res.render('player');
});

module.exports = router;
