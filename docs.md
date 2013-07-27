---
layout: docs
title: Documentation
subtitle: Usage
permalink: /docs/
name: docs
---

The easiest way to use JSHint is to install it as a Node program. To do so,
simply run the following command in your terminal (flag -g installs JSHint
globally on your system, omit it if you want to install JSHint in the current
working directory):

    $ npm install jshint -g

After you've done that you should be able to use the `jshint` program. The
simplest use case would be linting a single file or all JavaScript files in
a directory:

    $ jshint myfile.js
    myfile.js: line 10, col 39, Octal literals are not allowed in strict mode.

    1 error

If a file path is a dash (`-`) then JSHint will read from standard input.

#### Rhino

JSHint also has a Rhino build which you can download [here](/install/).

    $ rhino jshint-rhino.js myfile.js

Note that Rhino version doesn't support flags described above. It is, actually,
pretty basic.

#### Ignoring files

If you want JSHint to skip some files you can list them in a file named
`.jshintignore`. For example:

    legacy.js
    somelib/**
    otherlib/*.js

#### Hooking up into the file resolution logic

The CLI JSHint module exposes a public method `gather` that you can use
to hook up into the file resolution logic. This is useful if you want to
change how JSHint gathers files for linting. Do this only if you really
know what you're doing.

    #!/usr/bin/env node

    var cli = require("./src/cli/cli.js");

    cli.gather = function (opts) {
      // Your own file gathering logic.
      // For description of 'opts' see src/cli/cli.js:gather
    };

    cli.interpret(process.argv);

### JSHint as a JavaScript library

You can also use JSHint in your projects as a JavaScript library. You can either
install it as a Node module and include with `require` or [download our web
bundle](/install/) which exposes a global `JSHINT` function.

    // With Node
    var JSHINT = require("jshint").JSHINT;

`JSHINT` is a function that takes three formal parameters and returns a boolean:

    var success = JSHINT(source, options, globals);

The first parameter is either a string or an array of strings. If it is a
string, it will be split on '\n' or '\r'. If it is an array of strings, it is
assumed that each string represents one line. The source can be JavaScript or
JSON.

The second parameter is an optional object of options which control the
operation of JSHINT. Most of the options are booleans: They are all optional and
have a default value of false.

The third parameter is an object of global variables, with keys as names and a
boolean value to determine if they are assignable.

If your input passes JSHint tests, the function will return `true`. Otherwise,
it will return `false`. In that case, you can use `JSHINT.errors` to retrieve
the errors or request a complete report by calling the `JSHINT.data()` method.