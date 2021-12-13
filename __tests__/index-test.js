const path = require('path');
const stripAnsi = require('strip-ansi');
const { readJsonSync } = require('fs-extra');
const { getDatePart } = require('@lint-todo/utils');
const TodoSummaryFormatter = require('../index');

class MockConsole {
  buffer = [];

  log(str) {
    this.buffer.push(str);
  }

  toString() {
    return stripAnsi(this.buffer.join('\n'));
  }
}

describe('Todo Formatter', () => {
  it('can format output from results', () => {
    let mockConsole = new MockConsole();
    let todos = readJsonSync(
      path.resolve('./__tests__/__fixtures__/todos.json')
    );

    let formatter = new TodoSummaryFormatter({
      console: mockConsole,
    });
    let today = getDatePart(new Date('2021-06-09'));

    formatter.print({}, {}, todos, today);

    expect(mockConsole.toString()).toMatchInlineSnapshot(`
"Lint Todos (8 found, 7 past their due date)

Rule ID          File Path                                         Due Date      Due in
no-action        addon/templates/components/button-toggle.hbs      2021-03-01 -100 days
no-implicit-this addon/templates/components/button-toggle.hbs      2021-03-01 -100 days
no-implicit-this addon/templates/components/button-toggle.hbs      2021-03-01 -100 days
no-implicit-this addon/templates/components/button-toggle.hbs      2021-03-01 -100 days
no-implicit-this addon/templates/components/truncate-multiline.hbs 2021-03-01 -100 days
no-yield-only    addon/templates/just-yield.hbs                    2021-04-10  -60 days
no-implicit-this addon/templates/components/button-toggle.hbs      2021-05-10  -30 days
no-implicit-this addon/templates/components/button-toggle.hbs      2021-07-10   31 days"
`);
  });
});
