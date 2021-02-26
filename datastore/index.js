const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('unique ID cannot be found');
    } else {
      var uniqueFile = './test/testData/' + id.toString() + '.txt';
      fs.writeFile(uniqueFile, text, (err) => {
        if (err) {
          console.log('Cannot write file');
        } else {
          callback(null, { id, text});
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  var todos = [];
  fs.readdir('./test/testData', (err, files) => {
    _.each(files, file => {
      var id = file.split('.')[0];
      var text = id;
      todos.push({id, text});
    });
    callback(null, todos);
  });

};

exports.readOne = (id, callback) => {
  var filePath = './test/testData/' + id.toString() + '.txt';
  fs.readFile(filePath, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var filePath = './test/testData/' + id.toString() + '.txt';
  if (fs.existsSync(filePath)) {
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        console.log('Cannot update file');
      } else {
        callback(null, { id, text });
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
