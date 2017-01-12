var express = require('express');
var app = express();
var http = require('http');
var mongoose = require('mongoose');

var server = http.createServer(app);
var io = require('./server/routes/socket').listen(server);
var path = require('path');
var route = express.Router();

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'public'));

app.use(express.static(path.resolve(__dirname, 'public')));

require('./server/routes/public')(route);
app.use('/', route);

server.listen(port, function() {
	console.log('Servidor rodando em %s', port);
});