const path = require('path');
const { readJsonSync } = require('fs-extra');
const { getDatePart } = require('@lint-todo/utils');
const TodoSummaryFormatter = require('./');

let todos = readJsonSync(path.resolve('./__tests__/__fixtures__/todos.json'));
let formatter = new TodoSummaryFormatter();
let today = getDatePart(new Date('2021-05-05'));

console.log('\n\n\n');
formatter.print({}, {}, todos, today);
console.log('\n\n\n');
