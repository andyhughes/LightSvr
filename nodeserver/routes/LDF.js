var express = require('express');
var mongo = require('mongodb');

// Setup the route information for this entrypoint
var router = express.Router();


  // Reply with the info from a spcific element, in responce to a user submitted ID.
  router.get('/id/:id', function(req, res, next) {
    req.app.locals.LDF.find({'_id' : new mongo.ObjectId(req.params.id)}).toArray(function(err, result) {
      if (err) { throw err; }
      res.send(JSON.stringify(result));
    });
  });

  // If no ID is specified, just return the list of top level items.
  router.get('/id/', function(req, res, next) {
    req.app.locals.LDF.find({'parent' : null}).toArray(function(err, result) {
      if (err) { throw err; }
      res.send(JSON.stringify(result));
    });
  });

    // List all the children's titles, in responce to a user submitted ID.
    router.get('/child_titles/:id', function(req, res, next) {
      req.app.locals.LDF.find({'parent' : new mongo.ObjectId(req.params.id)}, {'_id' : 1, 'title' : 1}).toArray(function(err, result) {
        if (err) { throw err; }
        //var list = result.map((t) => t.title);
        res.send(JSON.stringify(result));
      });
    });

    // Default behaviour (when no criteria specified) is to send the titles of the top level items in the db structure.
    router.get('/child_titles/', function(req, res, next) {
      req.app.locals.LDF.find({'parent' : null}, {'_id' : 1, 'title' : 1}).toArray(function(err, result) {
        if (err) { throw err; }
        res.send(JSON.stringify(result));
      });
    });

    // Default behaviour (when no criteria specified) is to serve all elements from the db structure.
    router.get('/', function(req, res, next) {
      req.app.locals.LDF.find().toArray(function(err, result) {
        if (err) {  throw err; }
        res.send(JSON.stringify(result));
      });

});

module.exports = router;
