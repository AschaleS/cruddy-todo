const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
const fsAsync = Promise.promisifyAll(fs);

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  return fsAsync.readFileAsync(exports.counterFile)
    .then((fileData) => {
      callback(null, Number(fileData));
    })
    .catch((err) => {
      callback(null, 0);
    });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  return fsAsync.writeFileAsync(exports.counterFile, counterString)
    .then(() => {
      callback(null, counterString);
    })
    .catch((err) => {
      throw ('error writing counter');
    });

};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  return readCounter((err, counter) => {
    if (err) {
      console.log('error', err);
      callback(null, 0);
    } else {
      return writeCounter(counter + 1, (err) => {
        if (err) {
          console.log('error', err);
        } else {
          callback(null, zeroPaddedNumber(counter + 1));
        }
      });
    }
  });

};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
