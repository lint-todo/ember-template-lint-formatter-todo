const path = require("path");
const stripAnsi = require("strip-ansi");
const { getDatePart } = require("@lint-todo/utils");
const TodoSummaryFormatter = require("../index");

class MockConsole {
  buffer = [];

  get lines() {
    return this.buffer.map((message) => {
      return stripAnsi(message).trim();
    });
  }

  log(message) {
    this.buffer.push(message);
  }

  toString() {
    return stripAnsi(this.buffer.join("\n"));
  }
}

describe("Todo Formatter", () => {
  it("can format output from no results", () => {
    let mockConsole = new MockConsole();
    let formatter = new TodoSummaryFormatter({
      console: mockConsole,
    });
    let today = getDatePart(new Date("2021-05-05"));

    formatter.print({}, {}, [], today);

    expect(mockConsole.toString()).toMatchInlineSnapshot(
      `"Lint Todos (0 found, 0 overdue)"`
    );
  });

  it("can format output from results", () => {
    let mockConsole = new MockConsole();
    let formatter = new TodoSummaryFormatter({
      console: mockConsole,
      workingDir: path.join(__dirname, "__fixtures__"),
    });
    let today = getDatePart(new Date("2021-05-05"));

    formatter.print({}, {}, undefined, today);

    expect(mockConsole.lines).toMatchInlineSnapshot(`
      [
        "Lint Todos (8 found, 6 overdue)",
        "",
        "Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-action       
      Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-implicit-this
      Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-implicit-this
      Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-implicit-this
      Overdue 65 days 2021-03-01 addon/templates/components/truncate-multiline.hbs no-implicit-this
      Overdue 25 days 2021-04-10 addon/templates/just-yield.hbs                    no-yield-only   
      Due in 5 days   2021-05-10 addon/templates/components/button-toggle.hbs      no-implicit-this
      Due in 66 days  2021-07-10 addon/templates/components/button-toggle.hbs      no-implicit-this",
      ]
    `);
  });

  it("can format output from results for a single rule", () => {
    let mockConsole = new MockConsole();
    let formatter = new TodoSummaryFormatter({
      console: mockConsole,
      workingDir: path.join(__dirname, "__fixtures__"),
      rule: "no-implicit-this:error",
    });
    let today = getDatePart(new Date("2021-05-05"));

    formatter.print({}, {}, undefined, today);

    expect(mockConsole.lines).toMatchInlineSnapshot(`
      [
        "Lint Todos (6 found, 4 overdue)",
        "",
        "Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-implicit-this
      Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-implicit-this
      Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-implicit-this
      Overdue 65 days 2021-03-01 addon/templates/components/truncate-multiline.hbs no-implicit-this
      Due in 5 days   2021-05-10 addon/templates/components/button-toggle.hbs      no-implicit-this
      Due in 66 days  2021-07-10 addon/templates/components/button-toggle.hbs      no-implicit-this",
      ]
    `);
  });
});
