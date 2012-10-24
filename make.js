#!/usr/bin/env node

"use strict";

require("shelljs/make");

target.dev = function () {
	echo("Running Jekyll server on localhost:4000...");
	exec("jekyll --auto --server");
};

target.build = function () {
	// Change settings, combine and minify JavaScript/CSS.

	echo("Generating site...");
	exec("jekyll");
};
