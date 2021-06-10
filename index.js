const colors = require('colors/safe');
const Table = require('cli-table3');
const {
  readTodosSync,
  isExpired,
  getDatePart,
  differenceInDays,
  format,
} = require('@ember-template-lint/todo-utils');

class TodoSummaryFormatter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  print(
    results,
    todoInfo,
    todos = this._readTodos(this.options.workingDir),
    today = getDatePart()
  ) {
    let sorted = todos
      .sort((first, second) => {
        return first.errorDate - second.errorDate;
      })
      .map((todo) => {
        return {
          ruleId: todo.ruleId,
          filePath: todo.filePath,
          dueIn: differenceInDays(today, new Date(todo.errorDate)),
          date: format(todo.errorDate),
          isError: isExpired(todo.errorDate),
          isWarn: isExpired(todo.warnDate),
        };
      });

    this.console.log(`Lint Todos (${sorted.length} found)`);

    if (sorted.length > 0) {
      this.console.log('');
      this.console.log(
        `${
          sorted.filter((todo) => todo.isError).length
        } todos are currently past their due date`
      );

      let table = new Table({
        head: ['RuleID', 'File Path', 'Due Date', 'Due in'],
        style: {
          head: ['brightBlue'],
          border: ['gray'],
        },
      });

      for (let todo of sorted) {
        let dueInDays = `${todo.dueIn} days`;

        if (todo.isError) {
          dueInDays = colors.red(dueInDays);
        } else if (todo.isWarn) {
          dueInDays = colors.yellow(dueInDays);
        }

        table.push([todo.ruleId, todo.filePath, todo.date, dueInDays]);
      }

      this.console.log(table.toString());
    }
  }

  _readTodos(baseDir) {
    return [...readTodosSync(baseDir).values()];
  }
}

module.exports = TodoSummaryFormatter;
