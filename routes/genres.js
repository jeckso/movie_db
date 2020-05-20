var express = require('express');
var router = express.Router();
var app = express();
var cors = require('cors')
var bodyParser = require("body-parser");
var fs = require('fs');
var mysql = require('../database.js');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


router.get('/', function (req, res) {

    mysql.query(

        "  SELECT genre_name AS 'name', genre_id AS 'id' FROM genres;", function (error, results, fields) {
            console.log(results);
            // if (error) throw error;
            // results.forEach(function(item,i,results){
            //     var temps =results[i].genre_ids;
            //     var arr = temps.split(",");
            //     arr.forEach(function(item,j,arr){
            //         arr[j]=parseInt(arr[j]);
            //     })
            //     results[i].genre_ids = arr;
            // })
            // var o = {} // empty Object
            // var key = 'results';


            //   o[key] = results; // empty Array, which you can push() values into
            //    console.log(o[key]);

            res.send(JSON.stringify(results));
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});

module.exports = router;