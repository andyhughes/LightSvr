var express = require('express');

// Setup the route information for this entrypoint
var router = express.Router();

// Server some data from the database that matches known format (stored in a .js file) to test we can read from the DB
router.get('/', function(req, res, next) {
  req.app.locals.LDF.find().toArray(function(err, result) {
    if (err) {
      // TBD - log that the connection to the test server is not available.
      throw err;
  }

  console.log(req);
  console.log(JSON.stringify(req.param,null,2));

  res.send(JSON.stringify(result));
  });
});

module.exports = router;
