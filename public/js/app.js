var files =[];

var getFiles = function(url, extension, callback) {
  $.ajax({
    url: url,
    type: 'GET',
    crossDomain: true,
    dataType: 'json',
    success: function(data) {
      callback(data);
    }
  });
};

function getResource(path, cb, ext) {
//the RegExp removes the file extension
var proxyUrl = "http://localhost:9000/proxy";
var scdsUrl = encodeURIComponent("http://eat1-app53.corp.linkedin.com:8080/scds/dust/devBuild/" + ext + "?f=tl/apps" + path.replace(/(\.[^.]+$)/, ""));

url = proxyUrl + "?url=" + scdsUrl + "&method=GET" ;
$.ajax({
  type: 'GET',
  url: $.trim(url),
  converters: {
    "text json": function(textValue) {
      // force JSON to be interpreted as string
      return textValue;
    }
  },
  success: function(data) {
    cb(data);
  },
  error: function(error) {
    $("#ajax_error").html("<h2>ERROR: " + error.statusText+ "</h2>");
    if (error.responseText)
      cb(error.responseText);
  }
});
};

var fillDropDown = function(apps) {
  var templates = [];
  for (var app in apps) {
    for (var temp in apps[app]) {
      templates.push(apps[app][temp]);
    };
  };
  $('#search').typeahead({ source: templates, updater: function (item) {
    getResource(item, function(data) { $('#template').val(data) } ,'tl')
    return item;
  }});
};

$(document).ready(function(){
  var editor = ace.edit("template");
  editor.setTheme("ace/theme/chrome");
  editor.getSession().setTabSize(2);
  editor.getSession().setUseSoftTabs(true);

  var url = "http://localhost:9000/proxy?url=http%3A%2F%2Feat1-app53.corp.linkedin.com%3A8080%2Fscds%2Fdust%2FdevBuild%2Findex%3Ff%3Dtl%2Fapps%26e%3Dtl&method=GET";
  getFiles(url, 'tl', fillDropDown);

  var jsonEditor = ace.edit("json-editor");
});