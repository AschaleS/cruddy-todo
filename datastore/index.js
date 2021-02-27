const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
const fsAsync = Promise.promisifyAll(fs);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('unique ID cannot be found');
    } else {
      var file = exports.dataDir + '/' + id.toString() + '.txt';
      fs.writeFile(file, text, (err) => {
        if (err) {
          console.log('Cannot write file');
        } else {
          callback(null, { id, text});
        }
      });
    }
  });
};


exports.readAll = function(callback) {
  return fsAsync.readdirAsync(exports.dataDir)
    .then((files) => {
      let todos = files.map((file) => {
        var id = file.split('.')[0];
        var filePath = exports.dataDir + '/' + id.toString() + '.txt';
        return fsAsync.readFileAsync(path.join(exports.dataDir, file), 'utf-8')
          .then((text) => {
            return {id, text};
          });
      });
      Promise.all(todos).then((todos) => {
        callback(null, todos);
      });
    })
    .catch((err) => {
      callback(err);
    });
};


exports.readOne = (id, callback) => {
  var filePath = exports.dataDir + '/' + id.toString() + '.txt';
  fs.readFile(filePath, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var filePath = exports.dataDir + '/' + id.toString() + '.txt';
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
  var filePath = exports.dataDir + '/' + id.toString() + '.txt';
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log('Cannot delete file');
      } else {
        callback('Successfully deleted the file');
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
