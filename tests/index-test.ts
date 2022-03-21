import { fileURLToPath } from 'url';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { createBinTester } from '@scalvert/bin-tester';
import { addDays, subDays } from 'date-fns';
// eslint-disable-next-line node/no-missing-import
import Project from './utils/ember-template-lint-project';
import { format, getDatePart } from '@lint-todo/utils';

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

  it('can format output from todos', async function () {
    await project.setConfig({
      rules: {
        'no-bare-strings': true,
        'no-html-comments': true,
      },
    });

    await project.writeJSON({
      app: {
        templates: {
          'application.hbs':
            '<div>Bare strings are bad...</div><span>Very bad</span><!-- bad comment -->',
        },
      },
    });

    const result = await runBin('--update-todo', '--todo-days-to-error', '10', {
      env: {
        FORCE_COLOR: '0',
      },
    });
    const expiry = format(addDays(getDatePart(), 10));

    expect(result.exitCode).toEqual(0);
    expect(result.stdout.split('\n')).toEqual([
      'Lint Todos (3 found, 0 overdue)',
      '',
      `Due in 10 days ${expiry} app/templates/application.hbs no-bare-strings `,
      `Due in 10 days ${expiry} app/templates/application.hbs no-bare-strings `,
      `Due in 10 days ${expiry} app/templates/application.hbs no-html-comments`,
      '',
      'Lint Todos (3 found, 0 overdue)',
    ]);
  });

  it('can format output from todos that are outdated', async function () {
    await project.setConfig({
      rules: {
        'no-bare-strings': true,
        'no-html-comments': true,
      },
    });

    await project.writeJSON({
      app: {
        templates: {
          'application.hbs':
            '<div>Bare strings are bad...</div><span>Very bad</span><!-- bad comment -->',
        },
      },
    });

    const result = await runBin('--update-todo', '--no-clean-todo', '--todo-days-to-error', '10', {
      env: {
        TODO_CREATED_DATE: subDays(new Date(), 5).toJSON(),
        FORCE_COLOR: '0',
      },
    });
    const expiry = format(addDays(getDatePart(), 5));

    expect(result.exitCode).toEqual(0);
    expect(result.stdout.split('\n')).toEqual([
      'Lint Todos (3 found, 0 overdue)',
      '',
      `Due in 5 days ${expiry} app/templates/application.hbs no-bare-strings `,
      `Due in 5 days ${expiry} app/templates/application.hbs no-bare-strings `,
      `Due in 5 days ${expiry} app/templates/application.hbs no-html-comments`,
      '',
      'Lint Todos (3 found, 0 overdue)',
    ]);
  });
});
