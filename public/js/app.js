var files =[];

var getFiles = function(url, extension, callback) {
  $.ajax({
    url: url,
    type: 'GET',
    crossDomain: true,
    dataType: 'json',
    success: function(data) {
      files[extension] = data || [];
      callback(data);
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
  $('#search').typeahead({source: templates, items:5});
}

$(document).ready(function(){
  var url = "http://localhost:9000/proxy?url=http%3A%2F%2Feat1-app53.corp.linkedin.com%3A8080%2Fscds%2Fdust%2FdevBuild%2Findex%3Ff%3Dtl%2Fapps%26e%3Dtl&method=GET";
  getFiles(url, 'tl', fillDropDown);

  var jsonEditor = ace.edit("json-editor");
});