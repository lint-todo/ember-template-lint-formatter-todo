import { fileURLToPath } from 'node:url';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { createBinTester } from '@scalvert/bin-tester';
import Project from './utils/ember-template-lint-project';

describe('Todo Formatter', () => {
  let project: Project;
  const { setupProject, teardownProject, runBin } = createBinTester({
    binPath: fileURLToPath(
      new URL('../node_modules/ember-template-lint/bin/ember-template-lint.js', import.meta.url)
    ),
    staticArgs: ['.', '--format', fileURLToPath(new URL('..', import.meta.url))],
    createProject: () => new Project(),
  });

  beforeEach(async () => {
    project = await setupProject();
  });

  afterEach(() => {
    teardownProject();
  });

  it('can format output from no results', async () => {
    await project.setConfig({
      rules: {
        'no-bare-strings': 'error',
      },
    });
    await project.writeJSON({
      app: {
        templates: {
          'application.hbs': '<div></div>',
        },
      },
    });

    await project.setLintTodorc({
      warn: 5,
      error: 10,
    });

    const result = await runBin();

    expect(result.exitCode).toEqual(0);
    expect(result.stdout).toMatchInlineSnapshot('"Lint Todos (0 found, 0 overdue)"');
  });

  // it('can format output from results', () => {
  //   let mockConsole = new MockConsole();
  //   let formatter = new TodoSummaryFormatter({
  //     hasResultData: true,
  //     rule: '',
  //     workingDirectory: path.join(__dirname, 'fixtures'),
  //   });
  //   let today = getDatePart(new Date('2021-05-05'));

  //   formatter.print({}, {}, undefined, today);

  //   expect(mockConsole.lines).toMatchInlineSnapshot(`
  //     [
  //       "Lint Todos (8 found, 6 overdue)",
  //       "",
  //       "Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-action
  //     Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-implicit-this
  //     Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-implicit-this
  //     Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-implicit-this
  //     Overdue 65 days 2021-03-01 addon/templates/components/truncate-multiline.hbs no-implicit-this
  //     Overdue 25 days 2021-04-10 addon/templates/just-yield.hbs                    no-yield-only
  //     Due in 5 days   2021-05-10 addon/templates/components/button-toggle.hbs      no-implicit-this
  //     Due in 66 days  2021-07-10 addon/templates/components/button-toggle.hbs      no-implicit-this",
  //       "",
  //       "Lint Todos (8 found, 6 overdue)",
  //     ]
  //   `);
  // });

  // it('can format output from results for a single rule', () => {
  //   let mockConsole = new MockConsole();
  //   let formatter = new TodoSummaryFormatter({
  //     console: mockConsole,
  //     workingDir: path.join(__dirname, 'fixtures'),
  //     rule: 'no-implicit-this:error',
  //   });
  //   let today = getDatePart(new Date('2021-05-05'));

  //   formatter.print({}, {}, undefined, today);

  //   expect(mockConsole.lines).toMatchInlineSnapshot(`
  //     [
  //       "Lint Todos (6 found, 4 overdue)",
  //       "",
  //       "Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-implicit-this
  //     Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-implicit-this
  //     Overdue 65 days 2021-03-01 addon/templates/components/button-toggle.hbs      no-implicit-this
  //     Overdue 65 days 2021-03-01 addon/templates/components/truncate-multiline.hbs no-implicit-this
  //     Due in 5 days   2021-05-10 addon/templates/components/button-toggle.hbs      no-implicit-this
  //     Due in 66 days  2021-07-10 addon/templates/components/button-toggle.hbs      no-implicit-this",
  //       "",
  //       "Lint Todos (6 found, 4 overdue)",
  //     ]
  //   `);
  // });
});
