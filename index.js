var express = require('express');
var port = 9000;
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.redirect('/public/index.html');
});

app.listen(port);
console.log('express listening in port', port, '...')