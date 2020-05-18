var express = require('express');
var router = express.Router();
var app = express();
var cors = require('cors')
var bodyParser = require("body-parser");
var fs = require('fs');
var mysql = require('../database.js');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//Get popular movies
router.get('/', function (req, res) {
    mysql.query(
        'SELECT movies.movie_id AS \'id\', \n' +
        'AVG(DISTINCT movie_ratings.rating) AS \'vote_average\',\n' +
        ' movies.poster_url AS \'poster_path\',\n' +
        ' movies.title AS \'original_title\',\n' +
        ' movie_genres.movies_movie_id AS \'genre_ids\',\n' +
        ' movies.overview AS \'overview\',\n' +
        ' movies.release_date AS \'release_date\'\n' +
        ' FROM  (movies INNER JOIN movie_ratings on movies.movie_id = movie_ratings.movie_id)\n' +
        ' INNER JOIN movie_genres\n' +
        ' on movies.movie_id = movie_genres.movies_movie_id\n' +
        ' GROUP BY movies.movie_id;\n' +
        ' \n' +
        ';\n', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            var o = {} // empty Object
            var key = 'results';
            o["page"] =1;
            o["total_results"] =2;
            o["total_pages"] =1;

            o[key] = results; // empty Array, which you can push() values into
            console.log(o[key]);

            res.send(JSON.stringify(o));
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});

module.exports = router;