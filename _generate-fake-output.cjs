const path = require('path');
const { getDatePart, readTodoData } = require('@lint-todo/utils');
const TodoSummaryFormatter = require('./dist');

let todos = readTodoData(path.resolve(__dirname, '__tests__', '__fixtures__'), {
  engine: 'ember-template-lint',
});
let formatter = new TodoSummaryFormatter();
let today = getDatePart(new Date('2021-05-05'));

console.log('\n\n\n');
formatter.print({}, {}, todos, today);
console.log('\n\n\n');
