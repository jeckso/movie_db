var express = require('express');
var router = express.Router();
var app = express();
var cors = require('cors');
var VerifyToken = require('../auth/VerifyToken');
var bodyParser = require("body-parser");
var fs = require('fs');
var mysql = require('../database.js');
/* GET users listing. */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



router.post('/rate', VerifyToken, function (req, res) {


    mysql.query(
        'INSERT INTO `movie_ratings` (`rating`, `user_id`, `movie_id`) VALUES ("' + req.body.rating + '","' + req.body.decoded + '", "' + req.body.movie_id + '")', function (error, results, fields) {
            if (error) throw error;
            res.send({good: true});
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});
router.post('/review', VerifyToken, function (req, res) {


    mysql.query(
        'INSERT INTO `reviews` (`content`, `user_id`, `movie_id`) VALUES ("' + req.body.content + '","' + req.body.decoded + '", "' + req.body.movie_id + '")', function (error, results, fields) {
            if (error) throw error;
            res.send({good: true});
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});
router.get('/reviews', VerifyToken, function (req, res) {


    mysql.query(
        'INSERT INTO `reviews` (`content`, `user_id`, `movie_id`) VALUES ("' + req.body.content + '","' + req.body.decoded + '", "' + req.body.movie_id + '")', function (error, results, fields) {
            if (error) throw error;
            res.send({good: true});
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});

module.exports = router;