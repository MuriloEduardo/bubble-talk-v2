var express      = require('express');
var app 	     = express();
var http 	     = require('http');
var mongoose     = require('mongoose');
var bodyParser   = require('body-parser');
var server 	     = http.createServer(app);
var io 		     = require('./server/routes/socket').listen(server);
var path 	     = require('path');
var port 	     = process.env.PORT || 8080;
var configDB     = require('./server/config/database');
var cookieParser = require('cookie-parser');
var session 	 = require('express-session');
var passport 	 = require('passport');
var flash 		 = require('connect-flash');
var morgan 		 = require('morgan');
var MongoStore 	 = require('connect-mongo')(session);
var sessionStore = new MongoStore({mongooseConnection: mongoose.connection,ttl: 2*24*60*60});
var public 		 = express.Router();
var api 		 = express.Router();
var auth 		 = express.Router();

mongoose.connect(configDB.url, function(err, res) {
	mongoose.Promise = global.Promise;
	if(err){
		console.info('Nao foi possivel conectar a:' + configDB.url + ' com o erro: ' + err);
	}else{
		console.info('Conectado a ' + configDB.url);
	}
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
	saveUninitialized: true,
	resave: true,
	key: 'express.sid',
	secret: 'session_secret',
	store: sessionStore
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'public'));

app.use(express.static(path.resolve(__dirname, 'public')));

require('./server/routes/public')(public, passport);
require('./server/config/passport')(passport);
require('./server/routes/api')(api, passport);
require('./server/routes/auth')(auth, passport);

// Auth
app.use('/auth', auth);

// Public
app.use('/', public);

// API
app.use('/api', api);

server.listen(port, function() {
	console.log('Servidor rodando em %s', port);
});