'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dev_server = dev_server;

var _browserSync = require('browser-sync');

var _browserSync2 = _interopRequireDefault(_browserSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Setup basic server
function dev_server(config) {
  console.log('Serving ' + config.server_folder + ' on port ' + config.server_port);
  (0, _browserSync2.default)({
    server: {
      port: config.server_port,
      baseDir: config.server_folder
    }
  });
}