"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** All tasks */

var TaskManager = exports.TaskManager = (function () {
  function TaskManager() {
    _classCallCheck(this, TaskManager);

    this.debug = false;
    this._factory = [];
    this._tasks = [];
  }

  /** Logging */

  _createClass(TaskManager, [{
    key: "trace",
    value: function trace(msg) {
      if (this.debug) {
        console.log(msg);
      }
    }

    /** Let a task register itself */

  }, {
    key: "register",
    value: function register(factory) {
      this._factory.push(factory);
    }

    /** Run all tasks */

  }, {
    key: "tasks",
    value: function tasks(config) {
      this.trace("Creating and binding " + this._factory.length + " tasks...");
      for (var i = 0; i < this._factory.length; ++i) {
        //console.log("Registering task" + i);
        try {
          //console.log(this._factory[i]);
          var task = new this._factory[i](config);
          task.tasks();
          this.trace("Registered task: " + task.name);
          this._tasks.push(task);
          //console.log("New factory length: " + this._factory.length);
        } catch (err) {
          console.log(err);
          console.log(err.stack);
        }
      }
    }

    /** Register all watch handlers */

  }, {
    key: "watch",
    value: function watch() {
      for (var i = 0; i < this._tasks.length; ++i) {
        var task = this._tasks[i];
        task.watch();
      }
    }
  }]);

  return TaskManager;
})();

/** A single task */

var Task = exports.Task = (function () {
  function Task(name, config) {
    _classCallCheck(this, Task);

    this.name = name;
    this.config = config;
  }

  /** Register tasks here */

  _createClass(Task, [{
    key: "tasks",
    value: function tasks() {}

    /** Run any watch for local tasks here */

  }, {
    key: "watch",
    value: function watch() {}
  }]);

  return Task;
})();

/// Singleton

var manager = exports.manager = new TaskManager();