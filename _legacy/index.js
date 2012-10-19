$(document).ready(function () {
	var editor = ace.edit("template-editor");
  editor.setTheme("ace/theme/chrome");
  editor.getSession().setTabSize(2);
  editor.getSession().setUseSoftTabs(true);

  editor.getSession().setMode("ace/mode/html");

  var editor = ace.edit("context-editor");
  editor.setTheme("ace/theme/chrome");
  editor.getSession().setTabSize(2);
  editor.getSession().setUseSoftTabs(true);
  editor.getSession().setMode("ace/mode/javascript");
});