var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// src/index.ts
var import_chalk = __toESM(require("chalk"), 1);
var import_columnify = __toESM(require("columnify"), 1);
var import_utils = require("@lint-todo/utils");
function getRuleId(rule) {
  const indexOfSeparator = rule.indexOf(":") + 1;
  return rule.slice(0, Math.max(0, indexOfSeparator - 1));
}
function getDate(date) {
  return date || (0, import_utils.getDatePart)().getTime();
}
module.exports = class TodoSummaryFormatter {
  constructor(options) {
    this.options = options;
  }
  format() {
    const output = [];
    const today = (0, import_utils.getDatePart)();
    let todos = /* @__PURE__ */ new Set();
    if ((0, import_utils.todoStorageFileExists)(this.options.workingDirectory)) {
      todos = (0, import_utils.readTodoData)(this.options.workingDirectory, {
        engine: "ember-template-lint",
        filePath: ""
      });
    }
    let sorted = [...todos].sort((first, second) => {
      return getDate(first.errorDate) - getDate(second.errorDate);
    }).map((todo) => {
      return {
        ruleId: todo.ruleId,
        filePath: todo.filePath,
        dueIn: (0, import_utils.differenceInDays)(today, new Date(getDate(todo.errorDate))),
        date: (0, import_utils.format)(getDate(todo.errorDate)),
        isError: (0, import_utils.isExpired)(todo.errorDate, today.getTime()),
        isWarn: (0, import_utils.isExpired)(todo.warnDate, today.getTime())
      };
    });
    const printTotal = () => {
      output.push(`Lint Todos (${sorted.length} found, ${sorted.filter((todo) => todo.isError).length} overdue)`);
    };
    if (this.options.rule) {
      const ruleId = getRuleId(this.options.rule);
      sorted = sorted.filter((todo) => todo.ruleId === ruleId);
    }
    printTotal();
    if (sorted.length > 0) {
      output.push("");
      const data = [];
      for (const todo of sorted) {
        let dueInDays = `Due in ${todo.dueIn} days`;
        if (todo.isError) {
          dueInDays = import_chalk.default.red(`Overdue ${Math.abs(todo.dueIn)} days`);
        } else if (todo.isWarn) {
          dueInDays = import_chalk.default.yellow(dueInDays);
        } else {
          dueInDays = import_chalk.default.blueBright(dueInDays);
        }
        data.push({
          dueInDays,
          date: import_chalk.default.dim(todo.date),
          filePath: todo.filePath,
          ruleId: import_chalk.default.dim(todo.ruleId)
        });
      }
      output.push((0, import_columnify.default)(data, {
        showHeaders: false
      }), "");
      printTotal();
    }
    return output.join("\n");
  }
};
