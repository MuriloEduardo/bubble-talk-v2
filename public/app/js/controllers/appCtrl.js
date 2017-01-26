app.controller('appCtrl', ['$scope', '$stateParams', '$state', 'Socket', '$rootScope', 'Chat', function($scope, $stateParams, $state, Socket, $rootScope, Chat){

	$rootScope.messages = [];

	$scope.Chat = Chat.data;

	$scope.equipe = [
		{
			_id: '5818de55a0d58c5005dd6eeb',
			nome: 'Pedro Paulo'
		},
		{
			_id: '5859d42cca708915c406bfc6',
			nome: 'Ricardo Antonio'
		}
	];

	Socket.on('user:socket', function(data) {
		$rootScope.user.socket_id = data.id;
		console.log('user:socket')
		console.log(data)
	});

	Socket.connect(function() {
		console.log('conectou');
	});

	Socket.emit('change:room', $scope.Chat._id);

	Socket.on('change:room', function(data) {
		console.log('change:room');
	});
	
	console.log('$destroy')

	$scope.$on('$destroy', function(event) {
		console.log(event)
		Socket.disconnect(true);
		Socket.removeAllListeners();
	});
}]);