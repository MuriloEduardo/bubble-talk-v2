app.factory('Socket', ['socketFactory', function(socketFactory) {
	var myIoSocket = io.connect('http://127.0.0.1:8080');

	mySocket = socketFactory({
		ioSocket: myIoSocket
	});

	return mySocket;
}]);