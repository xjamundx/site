#!/usr/bin/env node

"use strict";

require("shelljs/make");
var markdown = require("markdown").markdown;

function table2html(src) {
  var header = "<table class='options table table-bordered table-striped'>";
  var footer = "</table>";

  return header + src.split("\n--").map(function (row) {
    var lines = row.trim().split("\n");
    var desc = markdown.toHTML(lines.slice(1).join("\n").trim());
    var name = lines[0];

    return [
      "<tr>",
        "<td class='name' id='" + name + "'>" + name + "</td>",
        "<td class='desc'>" + desc + "</td>",
      "</tr>"
    ].join("\n");
  }).join("\n") + footer;
}

function build() {
  ls("_tables/*.table").forEach(function (file) {
    table2html(cat(file))
      .to(file.replace(".table", ".html").replace("_tables", "_includes"));
  });
}

target.dev = function () {
  build();
	echo("Running Jekyll server on localhost:4000...");
	exec("jekyll --auto --server");
};

target.build = function () {
  build();
	// Change settings, combine and minify JavaScript/CSS.
	echo("Generating site...");
	exec("jekyll");
};