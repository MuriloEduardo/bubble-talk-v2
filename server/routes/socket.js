var socketio = require('socket.io');
module.exports.listen = function(server){
	var io = socketio.listen(server);
	io.on('connection', function(socket) {

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