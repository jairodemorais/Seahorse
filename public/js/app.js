$(document).ready(function(){
  var templateEditor = CodeMirror.fromTextArea(document.getElementById("template-editor"), {mode: "htmlmixed"});
  var jsonEditor = CodeMirror.fromTextArea(document.getElementById("json-editor"), {mode: "javascript"});
  var htmlEditor = CodeMirror.fromTextArea(document.getElementById("html-editor"), {mode: "htmlmixed"});

  var url = "/proxy?url=http%3A%2F%2Fabologna-ld.linkedin.biz%3A8080%2Fscds%2Fdust%2FdevBuild%2Findex%3Ff%3Dtl%2Fapps%26e%3Dtl&method=GET";
  $.get(url, function(apps) {
    var templates = [];
    apps = JSON.parse(apps);
    for (var app in apps) {
      for (var temp in apps[app]) {
        templates.push(apps[app][temp]);
      };
    };
    $('#search').removeAttr("disabled");
    $('#search').typeahead({ source: templates, updater: function (item) {
      var scdsUrl = "/proxy?url=" + encodeURIComponent("http://abologna-ld.linkedin.biz:8080/scds/dust/devBuild/tl?f=tl/apps" + item.replace(/(\.[^.]+$)/, ""));
      var url = scdsUrl + "&method=GET" ;
      $.get(url, function(data) {
        $("#template-error").hide();
        templateEditor.setValue(data);
      });
      return item;
    }});
  });

  $('#json-load').click(function(){
    $.get('/proxy?url=' + encodeURIComponent($('#json-url').val()) + '&method=GET', function(json){
      jsonEditor.setValue(json);
    });
  });

  $('#json-compile').click(function() {
    $("#template-error").hide();
    var template = templateEditor.getValue().replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');
    var context = jsonEditor.getValue().replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');
    if (!template) {
      event.preventDefault();
      $("#template-error").html("<span>ERROR: Please select a dust template or edit your own.</span>");
      $("#template-error").show();
    } else {
      var url = "http://abologna-ld.linkedin.biz:8080/scds/dust/compile";
      var qs = "?name=SeaHorse&template=" + encodeURIComponent(template) + "&json=" + encodeURIComponent(context);
      $.get($.trim("/proxy?url=" + encodeURIComponent(url + qs) + "&method=POST"), function(out) {
        htmlEditor.setValue(out);
        CodeMirror.commands["selectAll"](htmlEditor);
        htmlEditor.autoFormatRange(htmlEditor.getCursor(true), htmlEditor.getCursor(false));
        CodeMirror.commands["goLineEnd"](htmlEditor);
      }, 'text');
    }
  });
});