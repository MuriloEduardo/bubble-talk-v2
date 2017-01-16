var mongoose         = require('mongoose');
var session 	     = require('express-session');
var MongoStore 	     = require('connect-mongo')(session);
var sessionStore     = new MongoStore({mongooseConnection: mongoose.connection,ttl: 2*24*60*60});
var socketio 		 = require('socket.io');
var passportSocketIo = require('passport.socketio');
var cookieParser 	 = require('cookie-parser');

module.exports.listen = function(server){
	
	var io = socketio.listen(server);

	io.use(passportSocketIo.authorize({
		cookieParser: cookieParser,
		key: 'express.sid',
		secret: 'anystringoftext',
		store: sessionStore,
		success: onAuthorizeSuccess,
		fail: onAuthorizeFail
	}));

	function onAuthorizeSuccess(data, accept){
		console.log('successful connection to socket.io');

		// The accept-callback still allows us to decide whether to
		// accept the connection or not.
		accept(null, true);

		// OR

		// If you use socket.io@1.X the callback looks different
		accept();
	}

	function onAuthorizeFail(data, message, error, accept){
		if(error)
		throw new Error(message);
		console.log('failed connection to socket.io:', message);

		// We use this callback to log all of our failed connections.
		accept(null, false);

		// OR

		// If you use socket.io@1.X the callback looks different
		// If you don't want to accept the connection
		if(error)
		accept(new Error(message));
		// this error will be sent to the user as a special error-package
		// see: http://socket.io/docs/client-api/#socket > error-object
	}

	io.set('authorization', function(handshake, callback) {

	});

	io.sockets.on('connection', function(socket) {

		socket.emit('user:socket', {id: socket.id});
		
		var room;

		socket.on('message', function(msg) {
			io.sockets.in(room).emit('message', {message: msg, username: socket.id});
		})
		
		socket.on('disconnect', function() {
			console.log('Usuario: %s desconectado', socket.id);
		});

		socket.on('change:room', function(newRoom) {
			socket.leave(room);
			socket.join(newRoom);
			room = newRoom;

			io.sockets.in(room).emit('message', {message: 'Entrou', username: socket.id});
			io.to(room).emit('change:room', room);
		});
	});
};