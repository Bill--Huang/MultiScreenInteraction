/**
 * Created by huangzebiao on 15-3-25.
 */

var express = require('express');
var router = express.Router();

/* GET Canvas page. */
router.get('/', function (req, res, next) {
    res.render('canvas');
});


module.exports = router;
