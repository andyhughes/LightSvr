// Test script for nodeserver
//
// This connects to a running noteserver service running on localhost:3000


// Import required modules
var http = require('http');
var Promise = require('bluebird');

var STATIC_TEST = require('./static_test.js');


// Define test script variables
var TEST_PORT = 3000;
var TEST_HOST = 'localhost';
var TEST_PATH = '/test/'

// This is the test object, which passess a link to the test function and returns statistics about the call.
var TestObj = function (name, desc) {
  var startTime = null; // Private var to store start time
  var endTime = null; // Priave var to store end time
  var firedVar = false; // Private variable to see whether or not the test function has fired. Can only be updated by the func itself.
  var successVar = false; // Private variable that stores whether or not the test was a sucess.
  this.testName = (name) ? name : 'An unnamed test'; // Name of the test
  this.testDescription = (desc) ? desc : 'No description'; // Description of the test

  // Private method to setting up the test metrics - must be called by run().
  this.begin  = function () {
    firedVar = true; // Flag that this test has run (returned as a bool in the results object).
    startTime = new Date().getTime(); // Remember the start time so we can calculate how long this took to complete.
  };

  // Private method to finalise the metrics - must be called by run() when it is finished testing. Arg set as true if the test was successful.
  this.end  = function (s) {
    successVar = s; // Set the 'success' flag to indicate how the tests went.
    endTime = new Date().getTime(); // Remember the start time so we can calculate how long this took to complete.
  };

  // Public method that returns the results of a test.
  this.results = function  () {
    return {'testName': this.testName, 'fired' : firedVar, 'success' : successVar, 'time' : (((startTime == null) || (endTime == null)) ? null : (endTime - startTime)) };
  };

  // The test code should override the method below... this is then called when the test is fired.
  this.run = function () {};

  // Default behaviour when the functin is called is to execute the test code... the statement below ensures this happens
  return this.run(); // This should always return a Promise object.
};


// Helper function: requests data from the server using 'options', and compares it to a known object.
var retrieveAndCompare = function (options) {
  return new Promise(function (fulfill, reject) {
    var str = ''; // Responce string - built iterativly as the callback below fires.

    // Make the request
    http.request(options, (res) => {
      res.on('error', (err) => {
        reject(new Error("Nodeserver Connection Error: " + err.message));  // Handle errors that are ommited _during_ the recieving callback
      });
      res.on('data', (chunk) => {
        str += chunk;  // A chunk of data has been recieved, so append it to `str`
      });
      res.on('end', () => {
        // Now that we've got the entire test object, let's compare it to our static test data.
        var objReceived = JSON.parse(str);
        for (var i = 0; i < objReceived.length; i++) {
          delete objReceived[i]._id; // Remove the _id data (automatically added by mongodb) from all items in the results array
        }
        //console.log(JSON.stringify(objReceived) == JSON.stringify(objReference));
        if (JSON.stringify(objReceived) == JSON.stringify(options.objReference)) {
          console.log('test func found a match');
          fulfill();
        } else {
          console.log('test func did not match');
          reject();
        }
      });
    }).on('error', (err) => {
      reject(new Error("Nodeserver Connection Error: " + err.message)); // Catch connection errors, e.g. port or host unavailable.
    }).end();
  }); //end of return
};

var testFactory = function (options) {
  return function () {
    retrieveAndCompare(options);
  };
}


var StaticTest = function () {
  TestObj.apply(this, ['Static data', 'Test the nodeserver can serve static content (no DB read)']);
  this.run = function ()
  {
    this.begin(); // Set up the test object with tracking metrics.

    // Test code goes here. (DO NOT ALLOW CALLBACKS TO SHORT CIRCUIT THE TIMERS!!!)
    for (let i = 0; i < 1000000000; i++){var dd = 'tt'; var ff = 'fffff'; var aa = dd.concat(ff);}
    console.log('StaticTest.run() - this has overridded the TestObj run thingy');

    this.end(true); // Write to the results object before finishing.

  };
};

// Basic testing to ensure a simple connection
var testScript  = function () {
  console.log('Test script running...');
  var testArray = [];
  testArray.push(new TestObj());
  testArray.push(new StaticTest());

  console.log(JSON.stringify(testArray[1].results()));
  testArray[1].run();
  console.log(JSON.stringify(testArray[1].results()));
  //console.log(testArray);

  // Build the array of tests with associated Results object
/*
  var options = {};
  options = { host: TEST_HOST, port: TEST_PORT, path: TEST_PATH + 'static', objReference : STATIC_TEST.obj };
  testArray.push(new TestObj('Static data',testFactory(options), 'Test the nodeserver can serve static content (no DB read)'));
  options = { host: TEST_HOST, port: TEST_PORT, path: TEST_PATH + 'db_read', objReference : STATIC_TEST.db_read };
  testArray.push(new TestObj('DB Read',testFactory(options), 'Test the database read against .js content'));

  for (let t of testArray) {
    console.log(t.name + ': ' + t.description);
    //t.func().then(()=>{t.result = true}, t.result = false);
  }
*/
  // Test the nodeserver can serve static content (without using a database read)
  //var options = { host: TEST_HOST, port: TEST_PORT, path: TEST_PATH + 'static', objReference : STATIC_TEST.obj };
  //retrieveAndCompare(options,
  //  () => {console.log('Match!');},
  //  () => {console.log('Missmatch!');});

  // Test the database read against .js content
  //var options = { host: TEST_HOST, port: TEST_PORT, path: TEST_PATH + 'db_read', objReference : STATIC_TEST.db_read };
  //retrieveAndCompare(options,
  //  () => {console.log('Match!');},
  //  () => {console.log('Missmatch!');});
}


// Initiate the tests...
try {
  testScript();
} catch(err) {
  console.log(err.message);
  process.exit(1);  // There was a problem with one of the tests, log the error and exit 1 (failure)
}
