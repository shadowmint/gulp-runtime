import * as ut from './utils';

ut.root = __dirname + '..';

export function test_template(test) {
  var template = ut.template("tests/template.html", true);
  test.ok(template);
  test.ok(template({value: 100}) == '100\n');
  test.done();
}

export function test_json(test) {
  var value = ut.json("tests/values.json");
  test.ok(value.value == 100);
  test.ok(value.value2 == 101);
  test.done();
}

export function test_build_success(test) {
  ut.build_success();
  test.ok(true);
  test.done();
}
