// Test script for nodeserver
//
// This connects to a running noteserver service running on localhost:3000


// Import required modules

/* jshint node: true */
"use strict";

var Promise = require('bluebird'); // jshint ignore:line
var http = require('http');

var STATIC_TEST = require('./static_test.js');


// Define test script variables
var TEST_PORT = 3000;
var TEST_HOST = 'localhost';
var TEST_PATH = '/test/';


// This is the test object, which passess a link to the test function and returns statistics about the call.
var TestObj = function (name, desc) {
  this.tested = false; // Private variable to see whether or not the test function has fired. Can only be updated by the func itself.
  this.success = false; // Private variable that stores whether or not the test was a sucess.
  this.message = ''; // Used to pass error messages back in the results object.
  this.testName = (name) ? name : 'An unnamed test'; // Name of the test
  this.testDescription = (desc) ? desc : 'No description'; // Description of the test

  // Private method to finalise the metrics - must be called by run() when it is finished testing. Arg set as true if the test was successful.
  this.end  = function (all_good, msg) {
    this.tested = true;
    this.success = all_good; // Set the 'success' flag to indicate how the tests went.
    this.message = (msg) ? msg : ''; // Store an error message for debugging - optional.
  };

  // Public method that returns the results of a test.
  this.results = function  () { return {'testName': this.testName, 'tested' : this.tested, 'success' : this.success, 'message' : this.message }; };

  // The test code should override the method below... this is then called when the test is fired.
  this.run = function () {}; // This should always return a Promise object.
};


// Helper function: requests data from the server using 'options', and compares it to a known object.
var retrieveAndCompare = function (options, objReference) {
  return new Promise ((fulfill, reject) => {
    var str = ''; // Responce string - built iterativly as the callback below fires.
    // Make the request
    http.request(options, (res) => {
      res.on('error', (err) => {
        reject('Nodeserver Connection Error: ' + err.message); // Handle errors that are ommited _during_ the recieving callback
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
        //console.log('Do they match: ' + (JSON.stringify(objReceived) == JSON.stringify(objReference))); // Leave this line in (commented out) so we can debug easily.
        if(JSON.stringify(objReceived) == JSON.stringify(objReference)) {
          fulfill();
        } else {
          reject('Test failed because the strings did not match!');
        }
      });
    }).on('error', (err) => {
      reject('Nodeserver Connection Error: ' + err.message); // Catch connection errors, e.g. port or host unavailable.
    }).end();
  });
};


// Test the nodeserver can serve static content (without using a database read)
var StaticTest = function () {
  TestObj.apply(this, ['Static data', 'Test the nodeserver can serve static content (no DB read)']); // Inherit from the TestObj object.
  this.run = function () {
    return new Promise ((fulfill, reject) => {
      var options = { host: TEST_HOST, port: TEST_PORT, path: TEST_PATH + 'static' }; // Set up the connection to pull the info we want to check from the server.
      retrieveAndCompare(options, STATIC_TEST.static).then( // Compare the server responce to a known object.
        () => { this.end(true, 'Match'); fulfill(); }, // Successful completion, with a match.
        (err) => { this.end(false, err);fulfill(); } // Successful completion, without a match or with a caught error.
      );
    });
  };
};


// Test the nodeserver can serve data stored in the database - simple mongodb read.
var DBReadTest = function () {
  TestObj.apply(this, ['Static data', 'Test the nodeserver can serve static content (no DB read)']); // Inherit from the TestObj object.
  this.run = function () {
    return new Promise ((fulfill, reject) => {
      var options = { host: TEST_HOST, port: TEST_PORT, path: TEST_PATH + 'db_read' }; // Set up the connection to pull the info we want to check from the server.
      retrieveAndCompare(options, STATIC_TEST.db_read).then( // Compare the server responce to a known object.
        () => { this.end(true, 'Match'); fulfill(); }, // Successful completion, with a match.
        (err) => { this.end(false, err);fulfill(); } // Successful completion, without a match or with a caught error.
      );
    });
  };
};


// Helper function to prettify a number
var commarize = function (input, precision) {
  if (precision === undefined)
    precision = 2;
  return input.toFixed(precision).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Pretty print function to handle the results of the testScript()
var prettyPrintResults = function (duration, testArray) {
  var failures = 0;
  var results = null;

  // Print out all the status to the console.
  console.log('Results after all test completed:');
  console.log('   Test suite completed in: ' + commarize(duration/1000) + 's (equiv to ' + commarize(1000*duration/testArray.length, 0) + ' requests per second)');
  var successCount = testArray.filter( (test) => test.success).length;
  console.log('   Successess: ' + successCount + '. Failures: ' + (testArray.length - successCount) + '. (There were ' + testArray.length + ' total test functions)');
};


// Basic testing to ensure a simple connection
var testScript  = function () {
  console.log('Test script running...');
  var startTime = new Date().getTime(); // Start our timer showing how long it took all the tests to run.
  var testArray = []; // Array containing all of the test functions we want to iterate over: note that these will be executed in parallel.
  var promiseArray = []; // The Promise array ensures that all tests complete, and we wait for the promises to return before finalising the results and stopping the timer.

  // Add the test we want to do to the testArray.
  for (let i = 0; i < 100; i++) {
    testArray.push(new StaticTest());
    testArray.push(new DBReadTest());
  }

  // Populate the promise array with tests to perform (from the above testArray)... making sure that they aren't run yet (Promise.all() will run them shortly).
  for (let test of testArray) { promiseArray.push(test.run()); }

  Promise.all(promiseArray).then (
    () => {prettyPrintResults((new Date().getTime()) - startTime, testArray);},   // Handle success scenario:
    (err) => { console.log('Something went horribly wrong (relating the Promise array)! ' + err); }   // Handle failure scenario:
  );
};


// Initiate the tests... this is the main code that is triggered when this .js file is executed.
try {
  testScript();
} catch(err) {
  console.log(err.message);
  process.exit(1);  // There was a problem with one of the tests, log the error and exit 1 (failure)
}
