const chalk = require('chalk');
const columnify = require('columnify');
const {
  readTodoData,
  isExpired,
  getDatePart,
  differenceInDays,
  format,
} = require('@lint-todo/utils');

function getRuleId(rule) {
  const indexOfSeparator = rule.indexOf(':') + 1;

  return rule.slice(0, Math.max(0, indexOfSeparator - 1));
}

class TodoSummaryFormatter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  print(
    results,
    todoInfo,
    todos = readTodoData(this.options.workingDir, {
      engine: 'ember-template-lint',
    }),
    today = getDatePart()
  ) {
    let sorted = [...todos]
      .sort((first, second) => {
        return first.errorDate - second.errorDate;
      })
      .map((todo) => {
        return {
          ruleId: todo.ruleId,
          filePath: todo.filePath,
          dueIn: differenceInDays(today, new Date(todo.errorDate)),
          date: format(todo.errorDate),
          isError: isExpired(todo.errorDate, today.getTime()),
          isWarn: isExpired(todo.warnDate, today.getTime()),
        };
      });

    let printTotal = () => {
      this.console.log(
        `Lint Todos (${sorted.length} found, ${
          sorted.filter((todo) => todo.isError).length
        } overdue)`
      );
    };

    // a rule option has been passed to the CLI, meaning we want to restrict the output to just that rule
    if (this.options.rule) {
      let ruleId = getRuleId(this.options.rule);

      sorted = sorted.filter((todo) => todo.ruleId === ruleId);
    }

    printTotal();

    if (sorted.length > 0) {
      this.console.log('');

      let data = [];

      for (let todo of sorted) {
        let dueInDays = `Due in ${todo.dueIn} days`;

        if (todo.isError) {
          dueInDays = chalk.red(`Overdue ${Math.abs(todo.dueIn)} days`);
        } else if (todo.isWarn) {
          dueInDays = chalk.yellow(dueInDays);
        } else {
          dueInDays = chalk.blueBright(dueInDays);
        }

        data.push({
          dueInDays,
          date: chalk.dim(todo.date),
          filePath: todo.filePath,
          ruleId: chalk.dim(todo.ruleId),
        });
      }

      this.console.log(
        columnify(data, {
          showHeaders: false,
        })
      );
      this.console.log('');

      printTotal();
    }
  }
}

TodoSummaryFormatter.getRuleId = getRuleId;

module.exports = TodoSummaryFormatter;
