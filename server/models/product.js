// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var passportLocalMongoose = require('passport-local-mongoose');


var Product = new Schema({
    name: String,
    companyid:mongoose.Schema.Types.ObjectId,
    price: String,
    image: String
});

//User.plugin(passportLocalMongoose);
//=====================================================================================================
//app.get('/company', function (req, res) {
//    db = mongojs('nodewebapp4', ['company']);
//    db.company.find(function (err, docs) {
//        console.log(docs);
//        res.json(docs);
//    });
//});
//app.get('/products/:cid', function (req, res) {
//    db = mongojs('nodewebapp4', ['products']);
//    console.log('req.params.cid   :::>>> ' + req.params.cid + '  mongojs.ObjectId(req.params.cid) :>> ' + mongojs.ObjectId(req.params.cid));

//    db.products.find({ companyid: req.params.cid }, function (err, doc) {//"57b1c9ea1ad67434679157d9"
//        console.log(doc);
//        res.json(doc);
//    });
//});

//app.delete("/products/:id", function (req, res) {
//    db = mongojs('nodewebapp4', ['products']);
//    var id = req.params.id;
//    console.log(id);
//    //var productimage;
//    //db.products.findOne({ _id: mongojs.ObjectId(id) }, { image: 1 }, function (err, doc) { 
//    //    productimage = doc.image;
//    //});

//    db.products.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
//        res.json(doc);
//    });
//    //var filePath = "./client/uploads/products/" + productimage;
//    //fs.unlinkSync(filePath);
//});

//=====================================================================================================

module.exports = mongoose.model('product', Product);