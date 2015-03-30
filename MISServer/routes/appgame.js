/**
 * Created by huangzebiao on 15-3-19.
 */

var express = require('express');
var router = express.Router();

/* GET AppGame page. */
router.get('/', function (req, res, next) {
    res.render('appgame');
});

module.exports = router;
