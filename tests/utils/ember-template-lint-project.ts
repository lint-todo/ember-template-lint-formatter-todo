import { join } from 'path';
import { createRequire } from 'module';
import { BinTesterProject } from '@scalvert/bin-tester';
import { DaysToDecay, DaysToDecayByRule } from '@lint-todo/utils';

const require = createRequire(import.meta.url);

// this is the default .editorconfig file for new ember-cli apps, taken from:
// https://github.com/ember-cli/ember-new-output/blob/stable/.editorconfig
const DEFAULT_EDITOR_CONFIG = `
# EditorConfig helps developers define and maintain consistent
# coding styles between different editors and IDEs
# editorconfig.org
root = true
[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_style = space
indent_size = 2
[*.hbs]
insert_final_newline = false
[*.{diff,md}]
trim_trailing_whitespace = false
`;

// this is the default .template-lintrc.js used by ember-cli apps, taken from:
// https://github.com/ember-cli/ember-new-output/blob/stable/.template-lintrc.js
const DEFAULT_TEMPLATE_LINTRC = `
'use strict';
module.exports = {
  extends: 'recommended'
};
`;

export default class EmberTemplateLintProject extends BinTesterProject {
  constructor(name = 'fake-project', ...arguments_: any[]) {
    super(name, ...arguments_);
  }

  async setConfig(config: Record<string, any>) {
    const configFileContents =
      config === undefined
        ? DEFAULT_TEMPLATE_LINTRC
        : // eslint-disable-next-line unicorn/no-null
          `module.exports = ${JSON.stringify(config, null, 2)};`;

    this.files['.template-lintrc.js'] = configFileContents;

    await this.write();
  }

  getConfig() {
    return require(join(this.baseDir, '.template-lintrc'));
  }

  setEditorConfig(value = DEFAULT_EDITOR_CONFIG) {
    this.files['.editorconfig'] = value;

    return this.write();
  }

  setLintTodorc(daysToDecay: DaysToDecay, daysToDecayByRule?: DaysToDecayByRule) {
    const todoConfig = {
      'ember-template-lint': {
        daysToDecay,
        daysToDecayByRule,
      },
    };

    if (daysToDecayByRule) {
      todoConfig['ember-template-lint'].daysToDecayByRule = daysToDecayByRule;
    }

    return this.write({
      // eslint-disable-next-line unicorn/no-null
      '.lint-todorc.js': `module.exports = ${JSON.stringify(todoConfig, null, 2)}`,
    });
  }
}
