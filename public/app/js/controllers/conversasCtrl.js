app.controller('conversasCtrl', ['$scope', 'Socket', '$rootScope', function($scope, Socket, $rootScope){

	Socket.on('message', function(data) {
		if(data.username==$rootScope.user.socket_id) {
			data.username='Eu';
			if(data.message=='Entrou') data.message='Seja Bem Vindo!';
		}
		$rootScope.messages.push(data);
	});

	$scope.sendMessage = function(msg) {
		if(!msg) return;
		Socket.emit('message', msg);
		$scope.msg = '';
	}
}]);