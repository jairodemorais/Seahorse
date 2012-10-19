var express = require('express');
var port = 9000;
var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(port);
console.log('express listening in port', port, '...')