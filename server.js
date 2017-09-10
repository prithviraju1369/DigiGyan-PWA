var express = require('express');
var path=require('path');
var app = express();
var router=express.Router();
var bodyParser = require('body-parser');
var compression = require('compression');
var mongoose = require('mongoose');


//mongodb://localhost:27017/digigyan
mongoose.connect('mongodb://prithvi:prithvi1369@ds133004.mlab.com:33004/digigyan');

var profile = require('./server/routes/profile.js');

    
app.use(compression());
app.use(express.static(path.join(__dirname, './dist')));

app.use(bodyParser.urlencoded({ extended: false }));
 
app.use(bodyParser.json());

app.use('/profileapi', profile);






// This is the same output of calling JSON.stringify on a PushSubscription



/// app runs in port
app.listen(process.env.PORT || 3000,function(){
    console.log('listening at 3000');
});