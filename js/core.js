$(document).ready(function () {
  var editor = ace.edit('editor');
  var JavaScriptMode = require("ace/mode/javascript").Mode;
  editor.getSession().setMode(new JavaScriptMode());
  window.editor = editor;

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
});