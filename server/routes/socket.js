var mongoose    = require('mongoose');
var socketio    = require('socket.io');
var socketioJwt = require('socketio-jwt');

module.exports.listen = function(server){
	
	var io = socketio.listen(server);
	
	io.set('authorization', socketioJwt.authorize({
		secret: 'your secret or public key',
		handshake: true
	}));
	
	io.sockets.on('connection', function(socket) {
		
		console.log('Usuario: %s conectado', socket.id);

		socket.emit('user:socket', {id: socket.id});
		
		var room;

		socket.on('message', function(msg) {
			console.log("ROOOM %s", room)
			io.sockets.in(room).emit('message', {message: msg, username: socket.id});
		});
		
		socket.on('disconnect', function() {
			console.log('Usuario: %s desconectado', socket.id);
		});

		socket.on('change:room', function(newRoom) {
			socket.leave(room);
			socket.join(newRoom);
			room = newRoom;

			io.sockets.in(room).emit('message', {message: 'Entrou', username: socket.id});
			io.to(room).emit('change:room', room);
			
			console.log(socket.rooms)
		});
	});
};