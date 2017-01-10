app.controller('appCtrl', ['$scope', '$stateParams', '$state', 'Socket', function($scope, $stateParams, $state, Socket){
	
	var administrador = {
		_id: Date.now()
	};

	$scope.users = [];
	$scope.messages = [];
	$scope.app_id = $stateParams.id;

	Socket.connect(function() {
		Socket.emit('add-user', {username: administrador._id});
	});

	$scope.sendMessage = function(msg) {
		if(!msg) return;
		Socket.emit('message', {message: msg});
		$scope.msg = '';
	}
	
	Socket.emit('request-users', {});

	Socket.on('users', function(data) {
		$scope.users = data.users;
	});

	Socket.on('message', function(data) {
		$scope.messages.push(data);
	});

	Socket.on('add-user', function(data) {
		$scope.users.push(data.username);
		$scope.messages.push({username: data.username, message: 'Entrou'});
	});

	Socket.on('prompt-username', function(data) {
		// console.log(data)
	})

	Socket.on('remove-user', function(data) {
		$scope.users.splice($scope.users.indexOf(data.username), 1);
		$scope.messages.push({username: data.username, message: 'Saiu'});
	});

	$scope.$on('$destroy', function(event) {
		Socket.disconnect(true);
	});
}]);