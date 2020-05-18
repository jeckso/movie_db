var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var VerifyToken = require('./VerifyToken');
var mysql = require('../database');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file
router.get('/logout', function(req,res){
    res.cookie('token', 1,{expires: Date.now()});
    res.redirect(307, './api/chat/');
});
router.post('/login', function (req, res) {
    req.header("Access-Control-Allow-Origin", "*");
    req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    var hashedPassword = bcrypt.hashSync(req.body.pass, 8);

    mysql.query('SELECT * FROM `room` WHERE `name` = "' + req.body.name + '"', function (error, results, fields) {
        if (error) return res.status(500).send("There was a problem logging in`.");
        if (results == 0) {
            return res.status(404).send("No chat with name ", req.body.name, " found :(");
        } else {

            var passwordIsValid = bcrypt.compareSync(req.body.pass, results[0].pass);
            if (!passwordIsValid) return res.status(401).send({auth: false, token: null});

            var token = jwt.sign({id: results[0].id}, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
          // console.log(req.session);
            //res.setHeader("x-access-token", token);

            res.cookie('token', token, {
                expires: new Date(Date.now() + 86400),
                secure: false, // set to true if your using https
                httpOnly: true,
            });
        }
        res.status(200).send({auth: true, token: token});


    });

    // User.findOne({ email: req.body.email }, function (err, user) {
    //     if (err) return res.status(500).send('Error on the server.');
    //     if (!user) return res.status(404).send('No user found.');
    //
    //     // check if the password is valid
    //     var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    //     if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    //
    //     // if user is found and password is valid
    //     // create a token
    //     var token = jwt.sign({ id: user._id }, config.secret, {
    //         expiresIn: 86400 // expires in 24 hours
    //     });
    //
    //     // return the information including token as JSON
    //     res.status(200).send({ auth: true, token: token });
    // });

});

router.get('/logout', function (req, res) {
    res.status(200).send({auth: false, token: null});
});


router.post('/create', function (req, res) {
    req.header("Access-Control-Allow-Origin", "*");
    req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    var hashedPassword = bcrypt.hashSync(req.body.pass, 8);
    mysql.query('INSERT INTO `room` (`name`, `pass`) VALUES ("' + req.body.name + '", "' + hashedPassword + '")', function (err, user) {
        if (err) return res.status(409).send("Room already exist`.");
       return res.status(200).send("success");
        // res.redirect(307, 'api/chat/private/login/');
        //res.status(200).send("Chat created successfully!");

    });
});

router.get('/me', VerifyToken, function (req, res, next) {


    //  if (err) return res.status(500).send("There was a problem finding the user.");
    // if (!user) return res.status(404).send("No user found.");
    res.status(200).send("MMM Let's have sex");
    // res.status(200).send(user);


});

module.exports = router;