import {Task} from './task';

class Foo extends Task {
  constructor(config) {
    super('Foo', config);
  }
}

export function test_new_task(test) {
  test.ok(new Foo());
  test.done();
}
