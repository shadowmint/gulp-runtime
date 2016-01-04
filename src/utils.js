import p from 'path';
import fs from 'fs';
import yargs from 'yargs';
import handlebars from 'handlebars';

/** The root path for various functions to use */
export var root = './';

/**
 * Check for production mode
 * To use: gulp default --mode=production
 * By default this is run the first time we run gulp
 */
export function default_args(config) {
  config.PRODUCTION = yargs.argv.mode == 'production';
  try { read('.build', true); }
  catch(err) {
    if (!config.PRODUCTION) {
      console.log("Never run gulp before, defaulting to production build");
      config.PRODUCTION = true;
    }
  }
}

/** Build is successful */
export function build_success() {
  write('.build', { build: new Date() }, true);
}

/** Turn an arbitrary path into an absolute path relative to the root of the folder */
export function path(relative_path) {
  return p.resolve(p.join(root, relative_path))
}

/**
 * Read the target and parse it as a handlebars template
 * @param target The path to open and read
 * @param relative If the path is relative to the project root or absolute
 */
export function template(target, relative) {
  var raw = read(target, relative, true);
  return handlebars.compile(raw);
}

/**
 * Read a file from a path synchronously as json
 * @param target The file to open and parse as json
 * @param relative If this is a relative path, otherwise use absolute loading
 * @return A parsed json block or null.
 */
export function json(target, relative) {
  return JSON.parse(read(target, relative));
}

/**
 * Read a file from a path synchronously
 * @param target The file to open and read
 * @param relative If this is a relative path, otherwise use absolute loading
 * @return A parsed json block or null.
 */
export function read(target, relative, raw) {
  if (relative) { target = path(target); }
  return fs.readFileSync(target).toString();
}

/**
 * Write a file to a path synchronously
 * @param target The file to write
 * @param value The hash to convert to json and store
 * @param relative If this is a relative path, otherwise use absolute loading
 * @return true on success and false on failure
 */
export function write(target, value, relative) {
  if (relative) { target = path(target); }
  try {
    value = JSON.stringify(value);
    fs.writeFileSync(target, value);
    return true;
  }
  catch(err) {
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
export function wait_for(streams, callback) {
  var count = streams.length;
  var offset = 0;
  var handler = () => {
    offset += 1;
    if (offset == count) {
      callback();
    }
  };
  for (var i = 0; i < streams.length; ++i) {
    streams[i].on('end', handler);
  }
}
