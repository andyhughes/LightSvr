var express = require('express');

// Setup the route information for this entrypoint
var STATIC_TEST = require('../static_test.js');
var router = express.Router();

// Serve some data to the requester, which is checked agains the .js file content. No DB lookup occurs
router.get('/static', function(req, res, next) {
  var obj = STATIC_TEST.static;
  res.send(JSON.stringify(obj));
});


// Server some data from the database that matches known format (stored in a .js file) to test we can read from the DB
router.get('/db_read', function(req, res, next) {
  req.app.locals.testDataStatic.find().toArray(function(err, result) {
    if (err) {
      // TBD - log that the connection to the test server is not available.
      throw err;
  }
  res.send(JSON.stringify(result));
  });
});

module.exports = router;
