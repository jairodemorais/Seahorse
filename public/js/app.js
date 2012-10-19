$(document).ready(function(){
  var templateEditor = ace.edit("template-editor");
  templateEditor.setTheme("ace/theme/twilight");
  templateEditor.getSession().setTabSize(2);
  templateEditor.getSession().setUseSoftTabs(true);

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
  jsonEditor.setTheme("ace/theme/twilight");
  jsonEditor.getSession().setMode("ace/mode/javascript");

  $('#json-load').click(function(){
    $.get('/proxy?url=' + encodeURIComponent($('#json-url').val()) + '&method=GET', function(json){
      jsonEditor.setValue(json);
    });
  })
});