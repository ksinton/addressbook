// index.js

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var Promise    = require('promise');


var AddressBook = require('./datalayer/AddressBook.js');

addressBookObject = new AddressBook;

// configure app with body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.post('/user', function(req, res) {

    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;


    var addUserPromise = new Promise(function (resolve, reject) {

      try {
        response = addressBookObject.createUserAccount(name, username, password);
      }
      catch(error) {
        console.error(error);
        reject(error);
      }

      resolve();

      });

      addUserPromise.then(function() {
        res.statusCode = 201;
        res.json({ message: '1 record inserted 22' });
      },function(error) {
        res.statusCode = 500;
        res.json({ message: 'An error occured:' + error });
    });

});



router.get('/', function(req, res) {

    res.json({ message: 'hooray! welcome to our api!22' });
});


app.use('/', router);


app.listen(4000);
