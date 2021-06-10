# @scalvert/ember-template-lint-formatter-todo

> A custom formatter for `ember-template-lint` that will display a table of todos for your project, sorted by due date.

## Install

```shell
npm i @scalvert/ember-template-lint-formatter-todo

# or

yarn add @scalvert/ember-template-lint-formatter-todo
```

## Usage

```shell
ember-template-lint . --format @scalvert/ember-template-lint-formatter-todo
```

Running with the formatter will output a table of todos, ordered by due dates sorted by when they're due. If a todo is overdue, the 'Due in' days will turn red.

<img width="784" alt="Todo Formatter" src="https://user-images.githubusercontent.com/180990/121603990-98f4fa80-c9fe-11eb-887d-460f60f879f9.png">


