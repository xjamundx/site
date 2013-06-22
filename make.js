#!/usr/bin/env node

"use strict";

require("shelljs/make");

var markdown = require("markdown").markdown;
var path = require("path");

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
  var version;

  ls("get/*.js").forEach(function (file) {
    var match = file.match(/jshint\-(\d\.\d\.\d)\.js/);
    if (match) {
      version = match[1];
      ("<p>Current stable version is <strong>" + version + "</strong>.</p>").to("_includes/current.html");
    }
  });

  ls("_tables/*.table").forEach(function (file) {
    table2html(cat(file))
      .to(file.replace(".table", ".html").replace("_tables", "_includes"));
  });

  cat("_includes/stable.html")
    .replace("$jshint_bundle$", "<a href='/get/jshint-" + version + ".js'>jshint-" + version + ".js</a>")
    .replace("$jshint_rhino$", "<a href='/get/jshint-rhino-" + version + ".js'>jshint-rhino-" + version + ".js</a>")
    .to("_includes/stable.html");
}

target.dev = function () {
  target.get();
  build();
  echo("Running Jekyll server on localhost:4000...");
  exec("jekyll serve --watch");
};

target.build = function () {
  target.get();
  build();
  // Change settings, combine and minify JavaScript/CSS.
  echo("Generating site...");
  exec("jekyll build");
};

target.get = function () {
  var jshint_dir = "../jshint/";
  var jshint_config = require(path.join(jshint_dir, "package.json"));

  if (!test("-e", "./get")) {
    mkdir("./get");
  }
  rm("get/*.js");
  echo("Copying JSHint dist files to get/");
  cp([
    path.join(jshint_dir, "dist", "jshint-" + jshint_config.version + ".js"),
    path.join(jshint_dir, "dist", "jshint-rhino-" + jshint_config.version + ".js")],
    "./get/");
  echo("Done");
};
