var Connection = require('./Connect.js');

Connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

var AddressBook = function() {

    this.createUserAccount = function(name, username, password) {

        var sql = "INSERT INTO user (name, username, password) VALUES ('"+ name +"', '"+ username +"', '"+ password +"')";
        Connection.query(sql, function (err, result) {
          if (err) throw err;
        });
    }
}

module.exports = AddressBook;
