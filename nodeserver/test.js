// Test script for nodeserver
//
// This connects to a running noteserver service running on localhost:3000


// Import required modules
var http = require('http');
var STATIC_TEST = require('./static_test.js');


// Define test script variables
var TEST_PORT = 3000;
var TEST_HOST = 'localhost';
var TEST_PATH = '/test/db_read'


// Function to execute all of the test scripts
var testScript = function () {
  console.log('Test script running...');
  basicNodeConnectivity(TEST_HOST, TEST_PORT); // Basic connectivity test, localhost
};


// Basic testing to ensure a simple connection
var basicNodeConnectivity  = function (host, port) {
  var options = {
    host: host,
    port: port,
    path: TEST_PATH,
    method: 'GET'
  };

  var str = ''; // Responce string - built iterativly as the callback below fires.

  // Make the request
  http.request(options, (res) => {
    res.on('error', (err) => {
      console.log(err.message); // Handle errors that are ommited _during_ the recieving callback
    });
    res.on('data', (chunk) => {
      str += chunk;  // A chunk of data has been recieved, so append it to `str`
    });
    res.on('end', () => {
      // Now that we've got the entire test object, let's compare it to our static test data.
      var objReceived = JSON.parse(str);
      var objReference = STATIC_TEST.db_read; // Grab our test data
      for (var i = 0; i < objReceived.length; i++) {
        delete objReceived[i]._id; // Remove the _id data (automatically added by mongodb) from all items in the results array
      }
      console.log(JSON.stringify(objReceived));
      console.log(JSON.stringify(objReference));
      console.log('Do the objects match: ' + (JSON.stringify(objReceived) == JSON.stringify(objReference)));
    });
  }).on('error', (err) => {
    console.log("Connection Error: " + err.message); // Catch connection errors, e.g. port or host unavailable.
  }).end();
}


// Initiate the tests...
try {
  testScript();
} catch(err) {
  console.log(err.message);
  process.exit(1);  // There was a problem with one of the tests, log the error and exit 1 (failure)
}
