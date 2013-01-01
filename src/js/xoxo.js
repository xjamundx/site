/*jshint browser:true, expr:true, boss:true, strict:true, undef:true */
/*global $, Editor, JSHINT, Keen */

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

$.domReady(function () {
  "use strict";

  var templates = {
    error: '<a data-line="%(line)s" href="javascript:void(0)">Line %(line)s</a>: ' +
           '<code>%(code)s</code></p><p>%(msg)s',
    errorscope: '<a class="goto" data-line="%(line)s" href="javascript:void(0)">Inside \'%(scope)s\' on line %(line)s</a>: ' +
           '<code>%(code)s</code></p><p>%(msg)s'
  };

  var hasStorage;

  try {
    hasStorage = !!localStorage.getItem && !!JSON;
  } catch (e) {
    hasStorage = false;
  }

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

  function listOptions(els, opts) {
    var str = '/*jshint ';
    var res = [];

    for (var name in opts) {
      if (opts.hasOwnProperty(name)) {
        res.push(name + ':' + opts[name]);
      }
    }

    els.append("/*jshint " + res.join(", ") + " */");
  }

  function gotoErrorLine(ev) {
    var line = $(ev.target).attr('data-line') - 1;
    var str  = Editor.getLine(line);

    Editor.setSelection({ line: line, ch: 0 }, { line: line, ch: str.length });
    scrollTo(0, 0);
  }

  function reportFailure(report) {
    var errors = $('div.report ul.jshint-errors');

    errors[0].innerHTML = '';
    for (var i = 0, err; err = report.errors[i]; i++) {
      if (!err.scope || err.scope === "(main)") {
        errors.append(_('<li><p>' + templates.error + '</p></li>', {
          line: err.line,
          code: err.evidence ? escapeHTML(err.evidence) : '&lt;no code&gt;',
          msg:  err.reason
        }));
      } else {
        errors.append(_('<li><p>' + templates.errorscope + '</p></li>', {
          scope: err.scope.value === '.' ? err.scope.right : err.scope.value,
          line: err.scope.line,
          code: err.evidence ? escapeHTML(err.evidence) : '&lt;no code&gt;',
          msg:  err.reason
        }));
      }

      $('a[data-line="' + err.line + '"]').bind('click', gotoErrorLine);
    }

    listOptions($('div.report > div.error > div.options pre'), report.options);
    $('div.editorArea div.alert-message.error').show();
    $('div.report > div.error').show();
  }

  function reportSuccess() {
    $('div.editorArea div.alert-message.success').show();
  }

  $('button[data-action=lint]').bind('click', function () {
    var opts   = {};
    var checks = $('ul.inputs-list input[type=checkbox]');

    for (var i = 0, ch; ch = checks[i]; i++) {
      ch = $(ch);

      if (ch.hasClass('neg')) {
        if (!ch.attr('checked')) {
          opts[ch.attr('name')] = true;
        }
      } else {
        if (ch.attr('checked')) {
          opts[ch.attr('name')] = true;
        }
      }
    }

    $('div.report > div.alert-message').hide();
    $('div.editorArea div.alert-message').hide();
    $('div.report pre').html('');

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
  });

  $('button[data-action=save]').bind('click', function (ev) {
    var button = $(ev.target);
    button.html('Saving report...').attr('disabled', true);

    $('form.save-report textarea[name=code]').val(Editor.getValue());
    listOptions($('form.save-report textarea[name=data]'), JSHINT.data().options);
    $('form.save-report')[0].submit();
  });

  $('ul.inputs-list input[type=checkbox]').bind('change', function () {
    var checks = $('ul.inputs-list input[type=checkbox]');
    var opts   = {};

    for (var i = 0, ch; ch = checks[i]; i++) {
      ch = $(ch);
      opts[ch.attr('name')] = ch.attr('checked');
    }

    if (hasStorage) {
      localStorage.setItem('opts', JSON.stringify(opts));
    }
  });

  if (!hasStorage) {
    return;
  }

  var checks = $('ul.inputs-list input[type=checkbox]');
  var opts = JSON.parse(localStorage.getItem('opts') || '{}');
  opts = getUrlHashOpts(opts);

  for (var i = 0, ch; ch = checks[i]; i++) {
    ch = $(ch);
    if (opts[ch.attr('name')] === true) {
      ch.attr('checked', true);
    } else if (opts[ch.attr('name')] === false) {
      ch.removeAttr('checked');
    }

    ch.attr('title', ch.attr('name'));
  }
});
