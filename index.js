var express = require('express');
var http = require('http');
var url = require('url');
var port = 9000;
var app = express();

app.use(express.static(__dirname + '/public'));

app.set('scds.server', 'localhost')

app.get('/', function(req, res){
  res.redirect('/public/index.html');
});

app.get('/proxy', function(req, res) {
  var correctParameters = ('url' in req.query && 'method' in req.query);
  if (correctParameters){
    proxyRequest(req, res);
  } else {
    res.statusCode = 400;
    res.end(JSON.stringify({'error' : 'must provide both "url" and "method"'}));
  }
});

function proxyRequest(req, res) {
  var proxyTo = url.parse(req.query['url'], true);
  proxyTo.method = req.query['method'];

  var request = http.request(proxyTo, function(_res) {
    _res.pipe(res);
  });

  request.end();
}

app.listen(port);
console.log('express listening in port', port, '...')
