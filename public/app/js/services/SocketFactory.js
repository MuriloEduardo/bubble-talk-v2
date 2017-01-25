app.factory('Socket', ['socketFactory', function(socketFactory) {
	var myIoSocket = io.connect(window.location.host);
	
	mySocket = socketFactory({
		ioSocket: myIoSocket
	});

	return mySocket;
}]);