const { readTodosSync } = require('@ember-template-lint/todo-utils');

class TodoSummaryFormatter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  print(results, todos = this._readTodos(this.options.workingDir)) {
    let sorted = todos
      .sort((first, second) => {
        return second.errorDate - first.errorDate;
      })
      .map((todo) => {
        let d = new Date(todo.errorDate);
        let formattedDate = d.toString();

        return {
          ruleId: todo.ruleId,
          formattedDate,
        };
      });

    this.console.log('Todo Summary');
    this.console.log('');
    this.console.log(`Todos past due date: ${sorted.length}`);

    for (let todo of sorted) {
      this.console.log(`${todo.ruleId} - ${todo.formattedDate}`);
    }
  }

  _readTodos(baseDir) {
    return [...readTodosSync(baseDir).values()];
  }
}

module.exports = TodoSummaryFormatter;
