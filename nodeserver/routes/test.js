var express = require('express');
var mongodb = require('mongodb');

// Setup the route information for this entrypoint
var STATIC_TEST = require('../static_test.js');
var router = express.Router();

// Setup the connection to the mongodb database
var DB_INFO = require('../db_info.js');
var mongoClient = mongodb.MongoClient;

// Serve some data to the requester,
router.get('/static', function(req, res, next) {
  var obj = STATIC_TEST.obj
  res.send(JSON.stringify(obj));
});

router.get('/db_read', function(req, res, next) {
  mongoClient.connect(DB_INFO.test_svr + '/' + DB_INFO.db_name, (err, db) => {
    if (err)
    {
      console.log('DB Connection Error!');
      throw err;
    }
    db.collection('testData').find().toArray(function(err, result) {
      if (err) {
        throw err;
      }
      res.send(JSON.stringify(result));
    });
  });
});

module.exports = router;
