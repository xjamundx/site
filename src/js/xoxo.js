/*jshint browser:true, expr:true, boss:true, strict:true, undef:true */
/*global Editor, JSHINT, Keen, CodeMirror */

var Events = {
  ready: false,
  queue: [],

  attemptInit: function () {
    "use strict";

    if (Events.ready) {
      return;
    }

    var ev;
    if (typeof Keen !== "undefined") {
      Keen.configure("50e24abc3843312ecb000002", "5ee3b98b9b55482b9b4268c4a7132121");
      Events.ready = true;

      while (ev = Events.queue.pop()) {
        Events.add(ev[0], ev[1]);
      }

      return;
    }

    setTimeout(Events.attemptInit, 250);
  },

  add: function (name, data) {
    "use strict";

    if (!Events.ready) {
      Events.queue.push([name, data]);
      Events.attemptInit();
      return;
    }

    Keen.addEvent(name, data);
  }
};

(function start() {
  "use strict";

  var templates = {
    error: '<a data-line="%(line)s" role="button">Line %(line)s</a>: ' +
           '<code>%(code)s</code></p><p>%(msg)s',
    errorscope: '<a class="goto" data-line="%(line)s" role="button">Inside \'%(scope)s\' on line %(line)s</a>: ' +
           '<code>%(code)s</code></p><p>%(msg)s'
  };

  var hasStorage;

  try {
    hasStorage = !!localStorage.getItem && !!JSON;
  } catch (e) {
    hasStorage = false;
  }

  var $ = document.querySelector.bind(document);
  var $$ = document.querySelectorAll.bind(document);

  function _(string, context) {
    return string.replace(/%\(\w+\)s/g, function (match) {
      return context[match.slice(2, -2)];
    });
  }

  function escapeHTML(text) {
    var esc = text;
    var re  = [ [/&/g, "&amp;"], [/</g, "&lt;"], [/>/g, "&gt;"] ];

    for (var i = 0, len = re.length; i < len; i++) {
      esc = esc.replace(re[i][0], re[i][1]);
    }

    return esc;
  }

  function getUrlHashOpts(opts) {
    var kvps = location.hash.substring(1).split('&');
    var kvp;

    for (var i = 0; i < kvps.length; i++) {
      kvp = kvps[i].split('=');
      opts[kvp[0]] = (kvp[1] === 'true');
    }

    return opts;
  }

  function listOptions(elt, opts) {
    var res = [];

    for (var name in opts) {
      if (opts.hasOwnProperty(name)) {
        res.push(name + ':' + opts[name]);
      }
    }

    elt.innerHTML = "/*jshint " + res.join(", ") + " */";
  }

  function gotoErrorLine() {
    var line = this.getAttribute('data-line') - 1;
    var str  = Editor.getLine(line);
    Editor.setSelection({ line: line, ch: 0 }, { line: line, ch: str.length });
    scrollTo(0, 0);
  }

  var checks = $$('ul.inputs-list input[type=checkbox]');
  var lintBtn = $('button[data-action=lint]');
  var successMessage = $('div.editorArea div.alert-message.success');
  var errorMessage = $('div.editorArea div.alert-message');
  var reportBlock = $('#report');
  var optionsPre = reportBlock.querySelector('#report .options-string pre');

  function reportFailure(report) {
    successMessage.style.display = 'none';

    var errors = $('#report ul.jshint-errors');
    var errorsHTML = '';
    errors.innerHTML = '';

    for (var i = 0, err; err = report.errors[i]; i++) {
      if (!err.scope || err.scope === "(main)") {
        errorsHTML += _('<li><p>' + templates.error + '</p></li>', {
          line: err.line,
          code: err.evidence ? escapeHTML(err.evidence) : '&lt;no code&gt;',
          msg:  err.reason
        });
      } else {
        errorsHTML += _('<li><p>' + templates.errorscope + '</p></li>', {
          scope: err.scope.value === '.' ? err.scope.right : err.scope.value,
          line: err.scope.line,
          code: err.evidence ? escapeHTML(err.evidence) : '&lt;no code&gt;',
          msg:  err.reason
        });
      }
    }

    errors.innerHTML = errorsHTML;
    listOptions(optionsPre, report.options);

    var errorLineButtons = $$('#report a[data-line]');
    for (var j=0; j < errorLineButtons.length; j++) {
      errorLineButtons[j].addEventListener('click', gotoErrorLine, false);
    }

    errorMessage.style.display = 'block';
    reportBlock.style.display = 'block';
  }

  function reportSuccess() {
    errorMessage.style.display = 'none';
    reportBlock.style.display = 'none';
    successMessage.style.display = 'block';
  }

  function getOpts() {
    var opts   = {};
    for (var i = 0, ch; ch = checks[i]; i++) {
      if (ch.classList.contains('neg')) {
        if (!ch.checked) {
          opts[ch.name] = true;
        }
      } else {
        if (ch.checked) {
          opts[ch.name] = true;
        }
      }
    }
    return opts;
  }

  lintBtn.addEventListener('click', function () {
    var opts = getOpts();

    optionsPre.innerHTML = '';

    var value = Editor.getValue();
    var success = JSHINT(value, opts);

    if (success) {
      reportSuccess(JSHINT.data());
    } else {
      reportFailure(JSHINT.data());
    }

    Events.add("lint", {
      options: Object.keys(opts),
      lines: value.split("\n").length,
      success: success
    });
  }, false);

  function saveChecks() {
    var opts   = {};
    for (var i = 0, ch; ch = checks[i]; i++) {
      opts[ch.name] = ch.checked;
    }
    if (hasStorage) {
      localStorage.setItem('opts', JSON.stringify(opts));
    }
  }
  for (var i=0; i < checks.length; i++) {
    checks[i].addEventListener('change', saveChecks, false);
  }

  var textarea = $('#editor');
  var Editor = CodeMirror.fromTextArea(textarea, {
    theme: 'default',
    lineNumbers: true,
    onChange: function() {
      if (Editor.getValue() === '') {
        reportBlock.style.display = 'none';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
      }
    }
  });
  Editor.focus();
  Editor.setSelection({ line: 0, ch: 0 }, { line: 0, ch: textarea.value.length });

  function restoreChecks() {
    var opts = JSON.parse(localStorage.getItem('opts') || '{}');
    opts = getUrlHashOpts(opts);
    for (var i = 0, ch; ch = checks[i]; i++) {
      if (opts[ch.name] === true) {
        ch.checked = true;
      } else if (opts[ch.name] === false) {
        ch.checked = false;
      }
      ch.title = ch.name;
    }
  }
  if (hasStorage) {
    restoreChecks();
  }

})();
