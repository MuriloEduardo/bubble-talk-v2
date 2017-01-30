app.controller('appCtrl', ['$scope', '$stateParams', '$state', 'Socket', '$rootScope', 'Chat', function($scope, $stateParams, $state, Socket, $rootScope, Chat){
	
	Socket.connect();

	$scope.messages = [];

	$scope.Chat = Chat.data;

	Socket.on('user:socket', function(data) {
		$rootScope.user.socket_id = data.id;
		Socket.emit('change:room', $scope.Chat._id);
	});

	Socket.on('change:room', function(data) {
		console.log('change:room');
	});

	$scope.$on('$destroy', function(event) {
		console.log('$destroy')
		console.log(event)
		Socket.disconnect(true);
	});
}]);