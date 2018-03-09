// index.js

var express    = require('express');
var mysql      = require('mysql');
var app        = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

//create connection object for mysql
var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword"
});

//connection to mysql
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// configure app with body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// var port = process.env.PORT || 4000;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!22' });
});

app.use('/', router);


app.listen(4000);
