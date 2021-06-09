const path = require('path');
const stripAnsi = require('strip-ansi');
const { readJsonSync } = require('fs-extra');
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
    let today = new Date('2021-06-09');

    formatter.print({}, todos, today);

    expect(mockConsole.toString()).toMatchInlineSnapshot(`
"Lint Todos (7 found)

2 are currently past their due date
┌──────────────────┬───────────────────────────────────────────────────┬────────────┬──────────┐
│ RuleID           │ filePath                                          │ Due Date   │ Due in   │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-yield-only    │ addon/templates/just-yield.hbs                    │ 05/01/2021 │ -38 days │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-implicit-this │ addon/templates/components/button-toggle.hbs      │ 06/07/2021 │ -1 days  │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-action        │ addon/templates/components/button-toggle.hbs      │ 08/02/2021 │ 54 days  │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-implicit-this │ addon/templates/components/button-toggle.hbs      │ 08/02/2021 │ 54 days  │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-implicit-this │ addon/templates/components/button-toggle.hbs      │ 08/02/2021 │ 54 days  │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-implicit-this │ addon/templates/components/button-toggle.hbs      │ 08/02/2021 │ 54 days  │
├──────────────────┼───────────────────────────────────────────────────┼────────────┼──────────┤
│ no-implicit-this │ addon/templates/components/truncate-multiline.hbs │ 08/02/2021 │ 54 days  │
└──────────────────┴───────────────────────────────────────────────────┴────────────┴──────────┘"
`);
  });
});
