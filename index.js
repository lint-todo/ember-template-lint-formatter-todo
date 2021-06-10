const colors = require('colors/safe');
const Table = require('cli-table3');
const {
  readTodosSync,
  isExpired,
  getDatePart,
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
    today = getDatePart().getTime()
  ) {
    let sorted = todos
      .sort((first, second) => {
        return first.errorDate - second.errorDate;
      })
      .map((todo) => {
        return {
          ruleId: todo.ruleId,
          filePath: todo.filePath,
          dueIn: daysBetween(today, todo.errorDate),
          date: new Date(todo.errorDate).toISOString().split('T')[0],
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

function treatAsUTC(date) {
  let result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function daysBetween(startDate, endDate) {
  let millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.trunc(
    (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay
  );
}

module.exports = TodoSummaryFormatter;
