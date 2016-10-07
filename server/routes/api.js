var express = require('express');
var router = express.Router();
var passport = require('passport');
var multer1 = require('multer');
var fs = require('fs');
var User = require('../models/user.js');
//---------------------------------------------------------------------------
var _filename = "";
try {
    var storage1 = multer1.diskStorage({
        
        //multers disk storage settings
        destination: function (req, file, cb) {
            //cb(null, './client/uploads/products/');
            cb(null, './client/uploads/userProfiles/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            _filename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
            console.log(_filename);
            //Prodcut._filename = _filename;
            cb(null, _filename);
        }

    });
}
catch (e) {
    console.log('==============================================================file upload error ' + e);
}
//app.use(multer({ storage: storage }).single('file'));
var usermulter = multer1({ storage: storage1 }).single('file');

router.post('/register', function (req, res) {
    console.log(req.body);
    debugger;
    User.register(new User({ username: req.body.username, fullname: req.body.fullname, email: req.body.email }),
        req.body.password, function (err, account) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }
        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({
                status: 'Registration successful!'
            });
        });
    });
});
router.post('/updateprofile', usermulter, function (req, res) {
    console.log(req.body);
    var imagename = req.body.profilepic;
    if (req.file !== undefined)
        if (req.file.filename !== undefined || req.file.filename !== "") {
            imagename = req.file.filename;
            fs.exists('./client/uploads/userProfiles/' + req.body.image  , function (exists) {
                if (exists) {
                    //Show in green
                    console.log('File exists. Deleting now ...');
                    fs.unlink('./client/uploads/userProfiles/' + req.body.image);
                } else {
                    //Show in red
                    console.log('File not found, so not deleting.');
                }
            });
        }
    
    User.findOneAndUpdate({ _id: req.body._id }, {
        username : req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        sex : req.body.sex,
        weeklymailer : req.body.weeklymailer,
        country: req.body.country,
        profilepic: imagename
        
    }, function (err, doc) {
        if (err) throw err;
        
        return res.json(doc);

    });
});
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            res.status(200).json({
                status: 'Login successful!'
            });
        });
    })(req, res, next);
});
///Get User DEtails
router.get('/getdetails', function (req, res) {
    
    if (req.isAuthenticated()) {
        User.findById(req.user, function (err, user) {
            console.log(user);
            res.send(user);
        })
    }
});
router.get('/logout', function (req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

router.get('/status', function (req, res) {
    //debugger;
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
    res.status(200).json({
        status: true
    });
});


module.exports = router;