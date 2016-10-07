var express = require('express');
var router = express.Router();
var passport = require('passport');

var Company = require('../models/company.js');



router.get('/getAll', function (req, res) {
    if (req.isAuthenticated()) {
        Company.find(function (err, docs) {
            console.log(docs);
            return res.json(docs);
        })
    }
    //res.status(200).json({
    //    status: true
    //});

    
});
router.get('/getbyid/:id', function (req, res) {
    console.log(req.params.id);
    if (req.isAuthenticated()) {
        Company.findById({ _id: req.params.id }, function (err, docs) {
            console.log(docs);
            return res.json(docs);
        });
    }
});
router.post('/add', function (req, res) {
    if (req.isAuthenticated()) {
        var comp = new Company({ name: req.body.data.name });
        comp.save(function (err, docs) {
            console.log(docs);
            return res.json(docs);
        });
    }
});
router.put('/update/:id', function (req, res) {
    if (req.isAuthenticated()) {
        var comp = new Company({ _id: req.params.id });// , name: req.body.data.name });
                
        Company.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name }, function (err, doc) {
            if (err) throw err;
            
            return res.json(doc);

        });
    }
});
router.delete('/remove/:id', function (req, res) {
    console.log(req.params.id);
    if (req.isAuthenticated()) {
        var comp = new Company({ _id: req.params.id });
        comp.remove(function (err, docs) {
            console.log(docs);
            return res.json(docs);
        });
    }
});



module.exports = router;