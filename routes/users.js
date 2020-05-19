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
    var BreakException = {};
    req.body.exist = false;
    mysql.query(
        'SELECT * FROM `movie_ratings`  WHERE `user_id` = ' + req.body.decoded + ';', function (error, results, fields) {
            if (error) console.log(error);

            var o = {} // empty Object
            var key = 'results';

            o[key] = []; // empty Array, which you can push() values into
            var arr = results;
            try {
                results.forEach(function (item, i, arr) {


                    if (item.movie_id.toString() === req.body.movie_id) {

                        res.send({message: "Already exist"});
                        req.body.exist = true;

                        throw BreakException;
                    }

                })
            } catch (e) {
                if (e !== BreakException) throw e;

            }
            if (!req.body.exist) {
                mysql.query(
                    'INSERT INTO `movie_ratings` (`rating`, `user_id`, `movie_id`) VALUES ("' + req.body.rating + '","' + req.body.decoded + '", "' + req.body.movie_id + '")', function (error, results, fields) {
                        if (error) throw error;
                        res.send({message:"ok"});
                        //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                    });

            }
        });
    //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
});


router.post('/review', VerifyToken, function (req, res) {

    var BreakException = {};
    req.body.exist = false;
    mysql.query(
        'SELECT * FROM `reviews`  WHERE `user_id` = ' + req.body.decoded + ';', function (error, results, fields) {
            if (error) console.log(error);

            var o = {} // empty Object
            var key = 'results';

            o[key] = []; // empty Array, which you can push() values into
            var arr = results;
            try {
                results.forEach(function (item, i, arr) {


                    if (item.movie_id.toString() === req.body.movie_id) {

                        res.send({message: "Already exist"});
                        req.body.exist = true;

                        throw BreakException;
                    }

                })
            } catch (e) {
                if (e !== BreakException) throw e;

            }
            if (!req.body.exist) {
                mysql.query(
                    'INSERT INTO `reviews` (`content`, `user_id`, `movie_id`) VALUES ("' + req.body.content + '","' + req.body.decoded + '", "' + req.body.movie_id + '")', function (error, results, fields) {
                        if (error) throw error;
                        res.send({message: "ok"});
                        //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                    });

            }
        });

});
router.get('/reviews', VerifyToken, function (req, res) {


    mysql.query(
        "SELECT reviews.user_id AS 'user_id',\n" +
        "movies.movie_id AS 'movie_id',\n" +
        "movies.title AS 'title',\n" +
        "reviews.content AS 'conten',\n" +
        "reviews.id as 'id'\n" +
        "FROM movies INNER JOIN reviews on movies.movie_id =reviews.movie_id\n" +
        "WHERE reviews.user_id = " + req.body.decoded + ";", function (error, results, fields) {
            if (error) throw error;
            var o = {} // empty Object
            var key = 'results';

            o[key] = []; // empty Array, which you can push() values into

            results.forEach(function (item, i, results) {

                o[key].push(item);
            })
            if (results.length == 0) return res.status(404).send({message: "Not found"});
            console.log(o[key]);
            res.send(JSON.stringify(o));
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});

module.exports = router;