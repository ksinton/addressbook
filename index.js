// index.js

var express    = require('express');
var bodyParser = require('body-parser');
var Promise    = require('promise');
var jwt        = require('jsonwebtoken');
var bcrypt     = require('bcryptjs');

var AddressBook = require('./datalayer/AddressBook.js');

var app  = express();
addressBookObject = new AddressBook;

//used for the JWT tokens
var secret = 'hSNfIMjN6e66UWVIhxQI';

// configure app with body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// var port = process.env.PORT || 4000;

var router = express.Router();

router.post('/user/register', function(req, res) {

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

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    var responsePromise = addressBookObject.createUserAccount(name, username, hashedPassword);

    responsePromise.then(function() {
      res.statusCode = 201;

      // create a token
      var token = jwt.sign({ id: username }, secret, {});

      res.json({ message: 'Account Added', token: token });
    },function(error) {
      res.statusCode = 500;
      res.json({ message: 'Internal Server Error whiles saving the user record' });
    });

});

router.post('/user/login', function(req, res) {

  var username = req.body.username;
  var password = req.body.password;

  var accountPasswordPromise = addressBookObject.getAccountPassword(username);

  accountPasswordPromise.then(function(loginResponse) {

    if (loginResponse) {
      bcrypt.compare(password, loginResponse.password, function(error, response) {

        if(response === true) {
          res.statusCode = 200;

          // create a token
          var token = jwt.sign({ id: username }, secret, {});


          console.log("loginResponse.userId",loginResponse.userId);

          var userId = loginResponse.userId;

          res.json({ 'message': 'Login Success', 'userId':userId, 'token': token });
        } else {
          res.statusCode = 401;
          res.json({ message: 'Login Failed'});
        }
      });
    }  else {
      res.statusCode = 401;
      res.json({ message: 'Login Failed'});
    }


  },function(error) {
    res.statusCode = 500;
    res.json({ message: 'Internal Server Error whiles trying to login' });
  });

});


router.post('/contact', function(req, res) {

    var token = req.headers['x-access-token'];


    jwt.verify(token, secret, function(err, decoded) {

        if (err) {
          return res.status(500).send({ auth: false, message: 'Failed to authenticate token.'});
        } else {

          var firstName = req.body.firstName;
          var lastName = req.body.lastName;
          var phone = req.body.phone;
          var userId = req.body.userId;

          if (!firstName || (firstName.length < 1)) {
            res.statusCode = 400;
            res.json({ message: 'Unable to add user without firstName field' });
          }

          if (!lastName || (lastName.length < 1)) {
            res.statusCode = 400;
            res.json({ message: 'Unable to add user without lastName field' });
          }

          if (!phone || (phone.length < 1)) {
            res.statusCode = 400;
            res.json({ message: 'Unable to add user without phone field' });
          }

          var responsePromise = addressBookObject.createContact(firstName, lastName, phone, userId);

          responsePromise.then(function() {
            res.statusCode = 201;
            res.json({ message: 'Contact Added'});
          },
          function(error) {
            res.statusCode = 500;
            res.json({ message: 'Internal Server Error whiles saving the contact record' });
          });
        }

    });


});



router.delete('/contact/:contactId', function(req, res) {

    var token = req.headers['x-access-token'];


    jwt.verify(token, secret, function(err, decoded) {

        if (err) {
          return res.status(500).send({ auth: false, message: 'Failed to authenticate token.'});
        } else {

          var contactId = req.params.contactId;
          var responsePromise = addressBookObject.deleteContact(contactId);

          responsePromise.then(function(rowsAffected) {

            console.log("rowsAffected",rowsAffected);

            if (rowsAffected > 0) {
              res.statusCode = 202;
              res.json({ message: 'Contact Deleted'});
            } else {
              res.statusCode = 400;
              res.json({ message: 'Nothing Deleted.  Contact may not exist. '});
            }
          },
          function(error) {
            res.statusCode = 500;
            res.json({ message: 'Internal Server Error whiles deleting the contact record' });
          });
        }

    });


});



router.get('/', function(req, res) {

    res.json({ message: 'hooray! welcome to our api!22' });
});


app.use('/', router);


app.listen(4000);
