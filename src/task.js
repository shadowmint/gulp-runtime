/** All tasks */
export class TaskManager {

  constructor() {
    this.debug = false;
    this._factory = [];
    this._tasks = [];
  }

  /** Logging */
  trace(msg) {
    if (this.debug) {
      console.log(msg);
    }
  }

  /** Let a task register itself */
  register(factory) {
    this._factory.push(factory);
  }

  /** Run all tasks */
  tasks(config) {
    this.trace(`Creating and binding ${this._factory.length} tasks...`);
    for (var i = 0; i < this._factory.length; ++i) {
      //console.log("Registering task" + i);
      try {
        //console.log(this._factory[i]);
        var task = new this._factory[i](config);
        task.tasks();
        this.trace(`Registered task: ${task.name}`);
        this._tasks.push(task);
        //console.log("New factory length: " + this._factory.length);
      }
      catch(err) {
        console.log(err);
        console.log(err.stack);
      }
    }
  }

  /** Register all watch handlers */
  watch() {
    for (var i = 0; i < this._tasks.length; ++i) {
      var task = this._tasks[i];
      task.watch();
    }
  }
}

/** A single task */
export class Task {

  constructor(name, config) {
    this.name = name;
    this.config = config;
  }

  /** Register tasks here */
  tasks() {
  }

  /** Run any watch for local tasks here */
  watch() {
  }
}

/// Singleton
export var manager = new TaskManager();
