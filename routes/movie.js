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
        ' group_concat(DISTINCT movie_genres.genres_genre_id) AS \'genre_ids\',\n' +
        ' movies.overview AS \'overview\',\n' +
        ' movies.release_date AS \'release_date\'\n' +
        ' \n' +
        ' FROM  (movies INNER JOIN movie_ratings on movies.movie_id = movie_ratings.movie_id)\n' +
        ' INNER JOIN movie_genres\n' +
        ' on movies.movie_id = movie_genres.movies_movie_id\n' +
        ' GROUP BY movies.movie_id\n' +
        ' \n' +
        ' \n' +
        ';\n' +
        ' \n', function (error, results, fields) {
            if (error) return res.status(404).send({  message: "User not found" });
            results.forEach(function(item,i,results){
                var temps =results[i].genre_ids;
                var arr = temps.split(",");
                arr.forEach(function(item,j,arr){
                    arr[j]=parseInt(arr[j]);
                })
                results[i].genre_ids = arr;
            })
            var o = {} // empty Object
            var key = 'results';
            o["page"] =1;
            o["total_results"] =results.length;
            o["total_pages"] =1;

            o[key] = results; // empty Array, which you can push() values into
            console.log(o[key]);
            if(results.length == 0)return res.status(404).send({  message: "Not found" });
            res.send(JSON.stringify(o));
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});
router.get('/genre/:id', function (req, res) {
    var id = req.params.id;
    mysql.query(
        "SELECT\n" +
        "  movies.movie_id AS 'id',\n" +
        "  AVG(DISTINCT movie_ratings.rating) AS 'vote_average',\n" +
        "  movies.poster_url AS 'poster_path',\n" +
        "  movies.title AS 'original_title',\n" +
        "  group_concat(DISTINCT movie_genres.genres_genre_id) AS genre_ids,\n" +
        "  movies.overview AS 'overview',\n" +
        "  movies.release_date AS 'release_date'\n" +
        "FROM\n" +
        "  (\n" +
        "    movies\n" +
        "    INNER JOIN movie_ratings ON movies.movie_id = movie_ratings.movie_id\n" +
        "  )\n" +
        "  INNER JOIN movie_genres ON movies.movie_id = movie_genres.movies_movie_id\n" +
        " \n" +
        "GROUP BY\n" +
        "  movies.movie_id\n" +
        "   HAVING genre_ids  LIKE "+"'%"+id+"%';", function (error, results, fields) {
            if (error) throw error;
            results.forEach(function(item,i,results){
                var temps =results[i].genre_ids;
                var arr = temps.split(",");
                arr.forEach(function(item,j,arr){
                    arr[j]=parseInt(arr[j]);
                })
                results[i].genre_ids = arr;
            })
            var o = {} // empty Object
            var key = 'results';
            o["page"] =1;
            o["total_results"] =results.length;
            o["total_pages"] =1;

            o[key] = results; // empty Array, which you can push() values into
            console.log(o[key]);
            if(results.length == 0)return res.status(404).send({  message: "Not found" });
            res.send(JSON.stringify(o));
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});
router.get('/rating/:id', function (req, res) {
    var id = req.params.id;
    mysql.query(
        "SELECT\n" +
        "  movies.movie_id AS 'id',\n" +
        "  AVG(DISTINCT movie_ratings.rating) AS vote_average,\n" +
        "  movies.poster_url AS 'poster_path',\n" +
        "  movies.title AS 'original_title',\n" +
        "  group_concat(DISTINCT movie_genres.genres_genre_id) AS genre_ids,\n" +
        "  movies.overview AS 'overview',\n" +
        "  movies.release_date AS 'release_date'\n" +
        "FROM\n" +
        "  (\n" +
        "    movies\n" +
        "    INNER JOIN movie_ratings ON movies.movie_id = movie_ratings.movie_id\n" +
        "  )\n" +
        "  INNER JOIN movie_genres ON movies.movie_id = movie_genres.movies_movie_id\n" +
        " \n" +
        "GROUP BY\n" +
        "  movies.movie_id\n" +
        "   HAVING vote_average  LIKE "+"'%"+id+"%';", function (error, results, fields) {
            if (error) throw error;
            results.forEach(function(item,i,results){
                var temps =results[i].genre_ids;
                var arr = temps.split(",");
                arr.forEach(function(item,j,arr){
                    arr[j]=parseInt(arr[j]);
                })
                results[i].genre_ids = arr;
            })
            var o = {} // empty Object
            var key = 'results';
            o["page"] =1;
            o["total_results"] =results.length;
            o["total_pages"] =1;
           if(results.length == 0)return res.status(404).send({  message: "Not found" });
            o[key] = results; // empty Array, which you can push() values into
            console.log(o[key]);

            res.send(JSON.stringify(o));
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});
router.get('/:id', function (req, res) {
        var id = req.params.id;
        mysql.query(
            "SELECT group_concat(DISTINCT genres.genre_id) AS 'genre' ,\n" +
            "group_concat(DISTINCT genres.genre_name) AS 'genre_name',\n" +
            "movies.movie_id AS 'id',\n" +
            "movies.release_date AS 'release_date',\n" +
            "movies.title AS 'original_title',\n" +
            "movies.overview AS 'overview',\n" +
            "movies.runtime AS 'runtime',\n" +
            "movies.poster_url AS 'poster_path',\n" +
            "movies.release_date AS 'release_date',\n" +
            "AVG(DISTINCT movie_ratings.rating) AS 'vote_average'\n" +
            "FROM ((movies INNER JOIN movie_genres on movies.movie_id = movies_movie_id) INNER JOIN genres on genres_genre_id = genres.genre_id) INNER JOIN movie_ratings ON movies.movie_id = movie_ratings.movie_id\n" +
            "WHERE movies.movie_id = '"+id+"'\n" +
            " GROUP BY movies.movie_id;\n" +
            "\n" +
            "\n" +
            "\n", function (error, results, fields) {
                    if (error) throw error;
                    results.forEach(function(item,i,results){

                            var temps =results[i].genre;
                            var tempsName =results[i].genre_name;
                            var arrtemp = [];
                            var arr = temps.split(",");
                            var arrName = tempsName.split(",");
                            arr.forEach(function(item,j,arr){
                                    var obj = {};
                                    obj["id"]=parseInt(arr[j])
                                    obj["name"]=arrName[j];
                                    arrtemp.push(obj);
                            })
                            results[i].genre=arrtemp;
                    })


                    var o ={};
                    o = results[0];
                if(results.length == 0)return res.status(404).send({  message: "Not found" });
                    res.send(JSON.stringify(o));
                    //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            });
});
router.get('/:id/reviews', function (req, res) {
        var id = req.params.id;
        mysql.query(
            "SELECT reviews.id AS 'id',\n" +
            "reviews.content AS 'content',\n" +
            "user.email AS 'author'\n" +
            "FROM (reviews INNER JOIN movies ON reviews.movie_id = movies.movie_id)\n" +
            "INNER JOIN user on reviews.user_id = user.id\n" +
            "WHERE movies.movie_id ='"+id+"'\n" +
            ";", function (error, results, fields) {
                    if (error) throw error;
                var o = {} // empty Object
                var key = 'results';

                o[key] = []; // empty Array, which you can push() values into

                results.forEach(function(item,i,results){

                    o[key].push(item);
                })
                if(results.length == 0)return res.status(404).send({  message: "Not found" });
                console.log(o[key]);
                    res.send(JSON.stringify(o));
                    //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            });
});
router.get('/:id/participants', function (req, res) {
    var id = req.params.id;
    mysql.query(
        "SELECT participants.first_name AS 'first_name',\n" +
        "participants.last_name AS 'last_name',\n" +
        "role.name AS 'role'\n" +
        "FROM ((movies INNER JOIN movies_has_participants ON movies.movie_id = movies_has_participants.movies_movie_id)\n" +
        "INNER JOIN participants ON movies_has_participants.participants_participant_id = participants.participant_id)\n" +
        "INNER JOIN role ON movies_has_participants.role_role_id = role.role_id\n" +
        "WHERE movies.movie_id = '"+id+"';", function (error, results, fields) {
            if (error) throw error;
            var o = {} // empty Object
            var key = 'results';

            o[key] = []; // empty Array, which you can push() values into

            results.forEach(function(item,i,results){

                o[key].push(item);
            })
            if(results.length == 0)return res.status(404).send({  message: "Not found" });
            console.log(o[key]);
            res.send(JSON.stringify(o));
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});
// router.get('/:id/reviews', function (req, res) {
//     var id = req.params.id;
//     mysql.query(
//         "SELECT reviews.id AS 'id',\n" +
//         "reviews.content AS 'content',\n" +
//         "user.email AS 'author'\n" +
//         "FROM (reviews INNER JOIN movies ON reviews.movie_id = movies.movie_id)\n" +
//         "INNER JOIN user on reviews.user_id = user.id\n" +
//         "WHERE movies.movie_id ='"+id+"'\n" +
//         ";", function (error, results, fields) {
//             if (error) throw error;
//             var o = {} // empty Object
//             var key = 'results';
//
//             o[key] = []; // empty Array, which you can push() values into
//
//             results.forEach(function(item,i,results){
//
//                 o[key].push(item);
//             })
//             console.log(o[key]);
//             if(results.length == 0)return res.status(404).send({  message: "Not found" });
//             res.send(JSON.stringify(o));
//             //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//         });
// });
router.get('/:id/trailers', function (req, res) {
    var id = req.params.id;
    mysql.query(
        "SELECT movies.trailer_key AS 'key'\n" +
        "FROM movies\n" +
        "WHERE movie_id = '"+id+"';", function (error, results, fields) {
            if(results.length == 0)return res.status(404).send({  message: "Not found" });
            res.send(JSON.stringify(results));
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});
module.exports = router;