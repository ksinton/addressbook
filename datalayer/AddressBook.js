var Connection = require('./Connect.js');
var Promise    = require('promise');

  Connection.connect(function(err) {
    if (err) {
       console.log("ERROR: Unable to connect to mysql");
     } else {
       console.log("Connected");
    }
  });

var AddressBook = function() {

    this.createUserAccount = function(name, username, password) {

      var sql = "INSERT INTO user (name, username, password) VALUES ("+ Connection.escape(name) +", "+ Connection.escape(username) +", "+ Connection.escape(password) +")";

      var addUserPromise = new Promise(function (resolve, reject) {

        Connection.query(sql, function (error, result) {
          if (error) {
            console.log(error);
            reject(error)
          } else {
            resolve();
          }
        });

      });

      return addUserPromise;

    }
}

module.exports = AddressBook;
