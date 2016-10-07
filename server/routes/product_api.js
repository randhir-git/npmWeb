var express = require('express');
var router = express.Router();
var passport = require('passport');
var multer = require('multer');

var Product = require('../models/product.js');


var fs = require('fs');
//==============================================================================
var _filename = "";
try {
    var storage = multer.diskStorage({
        
        //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './client/uploads/products/');
            //cb(null, './client/uploads/userProfiles/');
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
var multerprodcut = multer({ storage: storage }).single('file');
//================================================================================================================
router.get('/getAll', function (req, res) {
    if (req.isAuthenticated()) {
        var cursor = Product.aggregate({
            $lookup:
 {
                from: 'companies',
                localField: 'companyid',
                foreignField: '_id',
                as: 'productsdetails'
            }
        });
        cursor.exec(function (err, doc) {
            console.log(doc);
            res.json(doc);
        });
    }
});

router.get('/getProductInCompany', function (req, res) {
    
    var cursor = Product.aggregate({
        $group : {
            _id : "$companyid",
            count: { $sum: 1 }
        }
    });
    cursor.exec(function (err, doc) {
        console.log(doc);
        res.json(doc);
    });

});



router.get('/getbyid/:id', function (req, res) {
    console.log(req.params.id);
    if (req.isAuthenticated()) {
        Product.findById({ _id: req.params.id }, function (err, docs) {
            console.log(docs);
            return res.json(docs);
        });
    }
});
router.post('/add', multerprodcut, function (req, res) {
    var product = new Product({
        name: req.body.name,
        companyid: req.body.companyid,
        price: req.body.price,
        image: req.file.filename
    });
    product.save(product, function (err, doc) {
        res.json(doc);
    });
});
router.put('/update/:id', multerprodcut, function (req, res) {
    
    var imagename = req.body.image;
    if (req.file !== undefined)
        if (req.file.filename !== undefined || req.file.filename !== "") {
            imagename = req.file.filename;
            fs.exists('./client/uploads/products/' + req.body.image  , function (exists) {
                if (exists) {
                    //Show in green
                    console.log('File exists. Deleting now ...');
                    fs.unlink('./client/uploads/products/' + req.body.image);
                } else {
                    //Show in red
                    console.log('File not found, so not deleting.');
                }
            });
        }
    Product.findOneAndUpdate({ _id: req.params.id }, {
        name: req.body.name,
        companyid: req.body.companyid,
        price: req.body.price,
        image: imagename
    }, function (err, doc) {
        if (err) throw err;
        
        return res.json(doc);

    });

});
router.delete('/remove/:id', function (req, res) {
    console.log(req.params.id);
    var pid = req.params.id;
    if (req.isAuthenticated()) {
        var prod = new Product({ _id: pid });
        
        Product.findOne({ _id: pid }, function (err, docs) {
            if (docs != null || docs !== undefined) {
                console.log(docs);
                fs.exists('./client/uploads/products/' + docs.image  , function (exists) {
                    if (exists) {
                        //Show in green
                        console.log('File exists. Deleting now ...');
                        fs.unlink('./client/uploads/products/' + docs.image);
                    } else {
                        //Show in red
                        console.log('File not found, so not deleting.');
                    }
                });
                prod.remove(function (err, docs) {
                    console.log(docs);
                    return res.json(docs);
                });
            }
        });
    }
});


module.exports = router;