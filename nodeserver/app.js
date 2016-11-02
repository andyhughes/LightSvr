var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var test = require('./routes/test');
var LDF = require('./routes/LDF');

var app = express();
var mongodb = require('mongodb');


// Initialise the mongodb database connection pool
try {
  var DB_INFO = require('./db_info.js'); // Grab the database server info from a static config file.
  var mongoClient = mongodb.MongoClient;
  mongoClient.connect(DB_INFO.test_svr + '/', (err, db) => { // Connect to the test DB
    if (err) {
      throw err; // Throw an error if there is a connection problem.
    }
    app.locals.testDataStatic = db.db(DB_INFO.test_db_name).collection(DB_INFO.test_collection_static); // Connect to the collection, and make it available to the global app scope.
    app.locals.LDF = db.db(DB_INFO.LDF_db_name).collection(DB_INFO.LDF_collection); // Connect to the LDF collection.
  });
} catch (err) {
  console.log('DB Connection Error: ' + err.message);
  process.exit(1);
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/test', test);
app.use('/LDF', LDF);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
