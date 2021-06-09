const path = require('path');
const stripAnsi = require('strip-ansi');
const { readJsonSync } = require('fs-extra');
const { getDatePart } = require('@ember-template-lint/todo-utils');
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
    let today = getDatePart(new Date('2021-06-09')).getTime();

    formatter.print({}, {}, todos, today);

    expect(mockConsole.toString()).toMatchInlineSnapshot(`
"Lint Todos (7 found)

2 todos are currently past their due date
┌──────────────────┬───────────────────────────────────────────────────┬────────────┬──────────┐
│ RuleID           │ File Path                                         │ Due Date   │ Due in   │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-yield-only    │ addon/templates/just-yield.hbs                    │ 2021-05-02 │ -37 days │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-implicit-this │ addon/templates/components/button-toggle.hbs      │ 2021-06-08 │ 0 days   │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-action        │ addon/templates/components/button-toggle.hbs      │ 2021-08-02 │ 55 days  │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-implicit-this │ addon/templates/components/button-toggle.hbs      │ 2021-08-02 │ 55 days  │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-implicit-this │ addon/templates/components/button-toggle.hbs      │ 2021-08-02 │ 55 days  │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-implicit-this │ addon/templates/components/button-toggle.hbs      │ 2021-08-02 │ 55 days  │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-implicit-this │ addon/templates/components/truncate-multiline.hbs │ 2021-08-02 │ 55 days  │
└──────────────────┴───────────────────────────────────────────────────┴────────────┴──────────┘"
`);
  });
});
