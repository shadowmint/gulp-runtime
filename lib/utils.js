'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.root = undefined;
exports.default_args = default_args;
exports.build_success = build_success;
exports.path = path;
exports.template = template;
exports.json = json;
exports.read = read;
exports.write = write;
exports.wait_for = wait_for;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** The root path for various functions to use */
var root = exports.root = './';

/**
 * Check for production mode
 * To use: gulp default --mode=production
 * By default this is run the first time we run gulp
 */
function default_args(config) {
  config.PRODUCTION = _yargs2.default.argv.mode == 'production';
  try {
    read('.build', true);
  } catch (err) {
    if (!config.PRODUCTION) {
      console.log("Never run gulp before, defaulting to production build");
      config.PRODUCTION = true;
    }
  }
}

/** Build is successful */
function build_success() {
  write('.build', { build: new Date() }, true);
}

/** Turn an arbitrary path into an absolute path relative to the root of the folder */
function path(relative_path) {
  return _path2.default.resolve(_path2.default.join(root, relative_path));
}

/**
 * Read the target and parse it as a handlebars template
 * @param target The path to open and read
 * @param relative If the path is relative to the project root or absolute
 */
function template(target, relative) {
  var raw = read(target, relative, true);
  return _handlebars2.default.compile(raw);
}

/**
 * Read a file from a path synchronously as json
 * @param target The file to open and parse as json
 * @param relative If this is a relative path, otherwise use absolute loading
 * @return A parsed json block or null.
 */
function json(target, relative) {
  return JSON.parse(read(target, relative));
}

/**
 * Read a file from a path synchronously
 * @param target The file to open and read
 * @param relative If this is a relative path, otherwise use absolute loading
 * @return A parsed json block or null.
 */
function read(target, relative, raw) {
  if (relative) {
    target = path(target);
  }
  return _fs2.default.readFileSync(target).toString();
}

/**
 * Write a file to a path synchronously
 * @param target The file to write
 * @param value The hash to convert to json and store
 * @param relative If this is a relative path, otherwise use absolute loading
 * @return true on success and false on failure
 */
function write(target, value, relative) {
  if (relative) {
    target = path(target);
  }
  try {
    value = JSON.stringify(value);
    _fs2.default.writeFileSync(target, value);
    return true;
  } catch (err) {
    console.log('Failed to write to path: ' + target);
    console.log(err);
    console.log(err.stack);
    return false;
  }
}

/**
 * Wait for a bunch of tasks to finish
 * You'd use this like:
 *
 *    gulp.task('foo', (callback) => {
 *      var streams = [ gulp.src(...).dest(...), gulp.src(...).dest(...) ];
 *      wait_for(streams, callback);
 *    });
 *
 * @param streams An array of streams which have not yet ended
 * @param callback The callback to invoke when all streams end
 */
function wait_for(streams, callback) {
  var count = streams.length;
  var offset = 0;
  var handler = function handler() {
    offset += 1;
    if (offset == count) {
      callback();
    }
  };
  for (var i = 0; i < streams.length; ++i) {
    streams[i].on('end', handler);
  }
}