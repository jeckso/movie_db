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
        'SELECT * FROM messages ORDER BY id DESC', function (error, results, fields) {
            if (error) throw error;
            res.send(results);
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});