var socketio = require('socket.io');
var users = [];
module.exports.listen = function(server){
	
	var io = socketio.listen(server);

	io.on('connection', function(socket) {
		var username = '';
		console.log('Um usuario se conectou');

		socket.on('request-users', function() {
			socket.emit('users', {users: users});
		});

		socket.on('message', function(data) {
			io.emit('message', {username: username, message: data.message});
		});

		socket.on('add-user', function(data) {
			if(users.indexOf(data.username)==-1) {
				io.emit('add-user', {username: data.username});
				username = data.username;
				users.push(data.username);
			} else {
				socket.emit('prompt-username', {message: 'User Already Exists'});
			}
		});
		
		socket.on('disconnect', function() {
			console.log('%s se desconectou', username);
			users.splice(users.indexOf(username), 1);
			io.emit('remove-user', {username: username});
		});
	});
};