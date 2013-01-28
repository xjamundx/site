---
layout: docs
title: About
permalink: /about/
---

JSHint is a community-driven tool to detect errors and potential problems in
JavaScript code and to enforce your team's coding conventions.

It is very flexible so you can easily adjust it to your particular coding
guidelines and the environment you expect your code to execute in.


### History

JSHint is a fork of [JSLint](http://jslint.com), the tool written and maintained
by Douglas Crockford. The project originally [started](http://anton.kovalyov.net/2011/02/20/why-i-forked-jslint-to-jshint/)
as an effort to make a more configurable version of JSLint--the one that doesn't
enforce one particular coding style on its users--but then transformed into a
separate static analysis tool with its own goals and ideals.

### Our Goal

Our goal is to help JavaScript developers write complex programs without worrying
about typos and language gotchas.

We believe that static code analysis programs&mdash;as well as other code quality
tools--are important and beneficial to the JavaScript community and, thus,
should not alienate their users.

### Why do we need static code analysis tools?

Any code base eventually becomes huge at some point, and simple mistakes--that
would not show themselves when written--can become show stoppers and waste
hours of debugging. And this is when static code analysis tools come into play
and help developers to spot such problems. JSHint scans a program written in
JavaScript and reports about commonly made mistakes and potential bugs. The
potential problem could be a syntax error, a bug due to implicit type
conversion, a leaking variable or something else.

Please note, that while static code analysis tools can spot many different kind
of mistakes, it can't detect if your program is correct, fast or has memory
leaks. You should always combine tools like JSHint with unit and functional
tests as well as with code reviews.

### Team

* **Anton Kovalyov**, maintainer.
  [Twitter](http://twitter.com/valueof), [Blog](http://anton.kovalyov.net).

* **Wolfgang Kluge**, core contributor.
  [Blog](http://klugesoftware.de/).

* **Josh Perez**, core contributor.
  [Twitter](http://twitter.com/goatslacker), [Blog](http://www.goatslacker.com/).

* And the whole [JSHint Community](https://github.com/jshint/jshint/contributors).