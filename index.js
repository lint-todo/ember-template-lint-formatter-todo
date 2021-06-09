const { differenceInDays, format } = require('date-fns');
const colors = require('colors/safe');
const Table = require('cli-table3');
const { readTodosSync } = require('@ember-template-lint/todo-utils');

class TodoSummaryFormatter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  print(
    results,
    todos = this._readTodos(this.options.workingDir),
    today = new Date()
  ) {
    let sorted = todos
      .sort((first, second) => {
        return first.errorDate - second.errorDate;
      })
      .map((todo) => {
        let errorDate = new Date(todo.errorDate);

        return {
          ruleId: todo.ruleId,
          filePath: todo.filePath,
          dueIn: differenceInDays(errorDate, today),
          date: format(errorDate, 'P'),
          isExpired: errorDate < today,
        };
      });

    this.console.log(`Lint Todos (${sorted.length} found)`);
    this.console.log('');
    this.console.log(
      `${
        sorted.filter((todo) => todo.isExpired).length
      } are currently past their due date`
    );

    let table = new Table({
      head: ['RuleID', 'filePath', 'Due Date', 'Due in'],
      style: {
        head: ['brightBlue'],
        border: ['gray'],
      },
    });

    for (let todo of sorted) {
      let dueInDays = `${todo.dueIn} days`;

      if (todo.isExpired) {
        dueInDays = colors.red(dueInDays);
      }

      table.push([todo.ruleId, todo.filePath, todo.date, dueInDays]);
    }

    this.console.log(table.toString());
  }

  _readTodos(baseDir) {
    return [...readTodosSync(baseDir).values()];
  }
}

module.exports = TodoSummaryFormatter;
