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

// var port = process.env.PORT || 4000;

var router = express.Router();

router.post('/user', function(req, res) {

    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;

    if (!name || (name.length < 1)) {
      res.statusCode = 400;
      res.json({ message: 'Unable to add user without name field' });
    }

    if (!username || (username.length < 4)) {
      res.statusCode = 400;
      res.json({ message: 'Unable to add user without valid username field.  User name must be at least 4 characters' });
    }

    if (username.length > 30) {
      res.statusCode = 400;
      res.json({ message: 'Unable to add user without valid username field.  User username must be no longer than 30 characters' });
    }

    if (!password || (password.length < 6)) {
      res.statusCode = 400;
      res.json({ message: 'Unable to add user without valid password field.  User password must be at least 4 characters' });
    }

    if (password.length > 30) {
      res.statusCode = 400;
      res.json({ message: 'Unable to add user without valid password field.  User name must be no longer than 30 characters' });
    }

    var responsePromise = addressBookObject.createUserAccount(name, username, password);

    responsePromise.then(function() {
      res.statusCode = 201;
      res.json({ message: '1 record inserted 22' });
    },function(error) {
      res.statusCode = 500;
      res.json({ message: 'Error whiles saving the user record' });
    });

});




router.get('/', function(req, res) {

    res.json({ message: 'hooray! welcome to our api!22' });
});


app.use('/', router);


app.listen(4000);
