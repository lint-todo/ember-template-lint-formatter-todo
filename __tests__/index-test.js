const path = require('path');
const { readJsonSync } = require('fs-extra');
const TodoSummaryFormatter = require('../index');

describe('Todo Formatter', () => {
  it('can format output from results', () => {
    let todos = readJsonSync(
      path.resolve('./__tests__/__fixtures__/todos.json')
    );
    debugger;

    let formatter = new TodoSummaryFormatter();
    let formatted = formatter.print({}, todos);

    expect(formatted).toMatchInlineSnapshot(`undefined`);
  });
});
