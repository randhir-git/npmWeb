// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;


//var multer = require('multer');
var debug = require('debug')('passport-mongo');
//var app = require('./app');
var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
//app.set('port', process.env.PORT || 3000);
// mongoose
//mongoose.connect('mongodb://localhost/mean-auth');
//mongoose.connect('mongodb://randhir84tu:randhir84tu@ds053206.mlab.com:53206/randhir');
mongoose.connect('mongodb://npmweb85:npmweb85@ds053126.mlab.com:53126/npmwebdb');
// user schema/model
var User = require('./server/models/user.js');

// create instance of express
var app = express();

// require routes
var routes = require('./server/routes/api.js');

// define middleware
app.use(express.static(path.join(__dirname, './client')));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'fuckinggirls7896799',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//app.all("/*", function (req, res, next) {
//    res.sendFile(path.join(__dirname, './client/views/main/', 'index.html'));
//});
////------------------
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//------------------
// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//---------------------------------------------------------------------------
//var _filename = "";
//try {
//    var storage = multer.diskStorage({
        
//        //multers disk storage settings
//        destination: function (req, file, cb) {
//            //cb(null, './client/uploads/products/');
//            cb(null, './client/uploads/userProfiles/');
//        },
//        filename: function (req, file, cb) {
//            var datetimestamp = Date.now();
//            _filename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
//            console.log(_filename);
//            //Prodcut._filename = _filename;
//            cb(null, _filename);
//        }

//    });
//}
//catch (e) {
//    console.log('==============================================================file upload error ' + e);
//}
//app.use(multer({ storage: storage }).single('file'));
//----------------------------------------------------------------------------



// routes
app.use('/user/', routes);
var Company = require('./server/models/company.js');
var companyroutes = require('./server/routes/company_api.js');
app.use('/company', companyroutes);


var Product = require('./server/models/product.js');
var productroutes = require('./server/routes/product_api.js');
app.use('/product', productroutes);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/views/main/', 'index.html'));
});



// error hndlers
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.end(JSON.stringify({
        message: err.message,
        error: {}
    }));
});

module.exports = app;
app.listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
});
//var server = app.listen(app.get('port'), function() {
//  debug('Express server listening on port ' + server.address().port);
//});
