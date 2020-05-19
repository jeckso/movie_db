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

router.post('/login', function (req, res) {
    req.header("Access-Control-Allow-Origin", "*");
    req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    mysql.query('SELECT * FROM `user` WHERE `email` = "' + req.body.email + '"', function (error, results, fields) {
        if (error) return res.status(500).send({  auth: 500 });
        if (results == 0) {
            return res.status(404).send({  auth: 404 });
        } else {

            var passwordIsValid = bcrypt.compareSync(req.body.password, results[0].password);
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
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    mysql.query('INSERT INTO `user` (`email`, `password`) VALUES ("' + req.body.email + '", "' + hashedPassword + '")', function (err, user) {
        if (err) return res.status(409).send({  registered: false });
       return res.status(200).send({  registered: true } );
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