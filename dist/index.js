var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/tsup/assets/esm_shims.js
var init_esm_shims = __esm({
  "node_modules/tsup/assets/esm_shims.js"() {
  }
});

// src/index.ts
import chalk from "chalk";
import columnify from "columnify";
import {
  readTodoData,
  isExpired,
  getDatePart,
  differenceInDays,
  format,
  todoStorageFileExists
} from "@lint-todo/utils";
var require_src = __commonJS({
  "src/index.ts"(exports, module) {
    init_esm_shims();
    function getRuleId(rule) {
      const indexOfSeparator = rule.indexOf(":") + 1;
      return rule.slice(0, Math.max(0, indexOfSeparator - 1));
    }
    function getDate(date) {
      return date || getDatePart().getTime();
    }
    module.exports = class TodoSummaryFormatter {
      constructor(options) {
        this.options = options;
      }
      format() {
        const output = [];
        const today = getDatePart();
        let todos = /* @__PURE__ */ new Set();
        if (todoStorageFileExists(this.options.workingDirectory)) {
          todos = readTodoData(this.options.workingDirectory, {
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
            dueIn: differenceInDays(today, new Date(getDate(todo.errorDate))),
            date: format(getDate(todo.errorDate)),
            isError: isExpired(todo.errorDate, today.getTime()),
            isWarn: isExpired(todo.warnDate, today.getTime())
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
              ruleId: chalk.dim(todo.ruleId)
            });
          }
          output.push(columnify(data, {
            showHeaders: false
          }), "");
          printTotal();
        }
        return output.join("\n");
      }
    };
  }
});
export default require_src();
