const colors = require('colors/safe');
const columnify = require('columnify');
const {
  readTodoData,
  isExpired,
  getDatePart,
  differenceInDays,
  format,
} = require('@lint-todo/utils');

class TodoSummaryFormatter {
  constructor(options = {}) {
    debugger;
    this.options = options;
    this.console = options.console || console;
  }

  print(
    results,
    todoInfo,
    todos = readTodoData(this.options.workingDir).filter(
      (todo) => todo.engine === 'ember-template-lint'
    ),
    today = getDatePart()
  ) {
    debugger;
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
          isError: isExpired(todo.errorDate, today.getTime()),
          isWarn: isExpired(todo.warnDate, today.getTime()),
        };
      });

    this.console.log(
      `Lint Todos (${sorted.length} found, ${
        sorted.filter((todo) => todo.isError).length
      } past their due date)`
    );

    if (sorted.length > 0) {
      this.console.log('');

      let data = [];

      for (let todo of sorted) {
        let dueInDays = `${todo.dueIn} days`;

        if (todo.isError) {
          dueInDays = colors.red(dueInDays);
        } else if (todo.isWarn) {
          dueInDays = colors.yellow(dueInDays);
        }

        data.push({
          ruleId: todo.ruleId,
          filePath: todo.filePath,
          date: todo.date,
          dueIn: dueInDays,
        });
      }

      this.console.log(
        columnify(data, {
          config: {
            ruleId: {
              headingTransform() {
                return colors.underline('Rule ID');
              },
            },
            filePath: {
              headingTransform() {
                return colors.underline('File Path');
              },
            },
            date: {
              headingTransform() {
                return colors.underline('Due Date');
              },
            },
            dueIn: {
              headingTransform() {
                return colors.underline('Due in');
              },
              align: 'right',
            },
          },
        })
      );
    }
  }
}

module.exports = TodoSummaryFormatter;
