import chalk from 'chalk';
import columnify from 'columnify';
import {
  readTodoData,
  isExpired,
  getDatePart,
  differenceInDays,
  format,
  TodoData,
  todoStorageFileExists,
} from '@lint-todo/utils';

interface EmberTemplateLintOptions {
  hasResultData: true;
  workingDirectory: string;
  rule: string;
}

function getRuleId(rule: string) {
  const indexOfSeparator = rule.indexOf(':') + 1;

  return rule.slice(0, Math.max(0, indexOfSeparator - 1));
}

function getDate(date: number | undefined) {
  return date || getDatePart().getTime();
}

//@ts-ignore
export = class TodoSummaryFormatter {
  options: EmberTemplateLintOptions;

  constructor(options: EmberTemplateLintOptions) {
    this.options = options;
  }

  format() {
    const output = [];
    const today = getDatePart();
    let todos = new Set<TodoData>();

    if (todoStorageFileExists(this.options.workingDirectory)) {
      todos = readTodoData(this.options.workingDirectory, {
        engine: 'ember-template-lint',
        filePath: '',
      });
    }

    let sorted = [...todos]
      .sort((first: TodoData, second: TodoData) => {
        return getDate(first.errorDate) - getDate(second.errorDate);
      })
      .map((todo) => {
        return {
          ruleId: todo.ruleId,
          filePath: todo.filePath,
          dueIn: differenceInDays(today, new Date(getDate(todo.errorDate))),
          date: format(getDate(todo.errorDate)),
          isError: isExpired(todo.errorDate, today.getTime()),
          isWarn: isExpired(todo.warnDate, today.getTime()),
        };
      });

    const printTotal = () => {
      output.push(
        `Lint Todos (${sorted.length} found, ${
          sorted.filter((todo) => todo.isError).length
        } overdue)`
      );
    };

    // a rule option has been passed to the CLI, meaning we want to restrict the output to just that rule
    if (this.options.rule) {
      const ruleId = getRuleId(this.options.rule);

      sorted = sorted.filter((todo) => todo.ruleId === ruleId);
    }

    printTotal();

    if (sorted.length > 0) {
      output.push('');

      const data = [];

      for (const todo of sorted) {
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

      output.push(
        columnify(data, {
          showHeaders: false,
        }),
        ''
      );

      printTotal();
    }

    return output.join('\n');
  }
};
