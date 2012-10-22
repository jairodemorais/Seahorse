$(document).ready(function(){
  var templateEditor = ace.edit("template-editor");
  templateEditor.setTheme("ace/theme/chrome");
  templateEditor.getSession().setTabSize(2);
  templateEditor.getSession().setUseSoftTabs(true);
  templateEditor.getSession().setMode("ace/mode/html");

  var url = "/proxy?url=http%3A%2F%2Feat1-app53.corp.linkedin.com%3A8080%2Fscds%2Fdust%2FdevBuild%2Findex%3Ff%3Dtl%2Fapps%26e%3Dtl&method=GET";
  $.get(url, function(apps) {
    var templates = [];
    apps = JSON.parse(apps);
    for (var app in apps) {
      for (var temp in apps[app]) {
        templates.push(apps[app][temp]);
      };
    };
    $('#search').typeahead({ source: templates, updater: function (item) {
      var scdsUrl = "/proxy?url=" + encodeURIComponent("http://eat1-app53.corp.linkedin.com:8080/scds/dust/devBuild/tl?f=tl/apps" + item.replace(/(\.[^.]+$)/, ""));
      var url = scdsUrl + "&method=GET" ;
      $.get(url, function(data) {
        templateEditor.setValue(data);
      });
      return item;
    }});
  });

  var jsonEditor = ace.edit("json-editor");
  jsonEditor.setValue("{json:'sample'}");
  jsonEditor.setTheme("ace/theme/chrome");
  templateEditor.getSession().setTabSize(2);
  templateEditor.getSession().setUseSoftTabs(true);
  jsonEditor.getSession().setMode("ace/mode/javascript");

  var htmlEditor = ace.edit("html-editor");
  jsonEditor.setValue("");
  jsonEditor.setTheme("ace/theme/chrome");
  templateEditor.getSession().setTabSize(2);
  templateEditor.getSession().setUseSoftTabs(true);
  jsonEditor.getSession().setMode("ace/mode/html");

  $('#json-load').click(function(){
    $.get('/proxy?url=' + encodeURIComponent($('#json-url').val()) + '&method=GET', function(json){
      jsonEditor.setValue(json);
    });
  });

  $('#json-compile').click(function() {
    var template = templateEditor.getValue().replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');
    var context = jsonEditor.getValue().replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');
    if (!template) {
      event.preventDefault();
      $("#ajax_error").html("<h2>ERROR: Please select a template</h2>");
    } else {
      var url = "http://eat1-app53.corp.linkedin.com:8080/scds/dust/compile";
      var qs = "?name=SeaHorse&template=" + encodeURIComponent(template) + "&json=" + encodeURIComponent(context);
      $.get($.trim("/proxy?url=" + encodeURIComponent(url + qs) + "&method=POST"), function(out) {
        htmlEditor.setValue(out);
      });
    }
  });
});