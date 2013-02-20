var editor;
var config = {
  node: { isActive: false, opts: { node: true } },
  browser: { isActive: false, opts: { browser: true, jquery: true } },
  vars: { isActive: false, opts: { undef: true, unused: true } },
  style: { isActive: false, opts: { white: true, quotmark: true, maxcomplexity: 5, trailing: true } }
};


(function () {
  // CodeMirror setup
  editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    mode: "javascript"
  });

  editor.focus();
  editor.setSelection({ line: 2, ch: 0 });

  // Configuration links

  Object.keys(config).forEach(function (key) {
    var el = document.getElementById("opt-" + key);

    el.addEventListener("click", function (ev) {
      ev.preventDefault();
      config[key].isActive = !config[key].isActive;
      el.className = config[key].isActive ? "active" : "";
      editor.focus();
    });
  });

  var lint = document.getElementById("lint");
  lint.addEventListener("click", function () {
    var opts = {};

    Object.keys(config).forEach(function (key) {
      if (!config[key].isActive) {
        return;
      }

      Object.keys(config[key].opts).forEach(function (opt) {
        opts[opt] = config[key].opts[opt];
      });
    });

    var res = JSHINT(editor.getValue(), opts);
    console.log(res);
  });
}());