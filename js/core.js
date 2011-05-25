$(document).ready(function () {
  var editor = ace.edit('editor');
  var JavaScriptMode = require("ace/mode/javascript").Mode;
  editor.getSession().setMode(new JavaScriptMode());

  function getOptions() {
    var options = {};

    $('input:checked').each(function () {
      options[$(this).attr('id')] = true;
    });

    return options;
  }

  $('div.sidebar h3').click(function () {
    if ($(this).next().is(':visible'))
      return;

    $('div.sidebar div.options.active')
      .hide()
      .removeClass('active');

    $(this)
      .next()
      .show()
      .addClass('active');
  });

  $('div.editor div.controls button').click(function () {
    var code = editor.getSession().getValue();
    var opts = getOptions();
    var succ = JSHINT(code, opts);

    alert(succ);
  })
});