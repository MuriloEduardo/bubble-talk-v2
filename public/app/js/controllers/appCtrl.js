app.controller('appCtrl', ['$scope', '$stateParams', '$state', 'Socket', '$rootScope', function($scope, $stateParams, $state, Socket, $rootScope){

	$rootScope.messages = [];

	$scope.app_id = $stateParams.id;

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

	Socket.connect(function() {
		console.log('conectou');
	});

	Socket.on('user:socket', function(data) {
		$rootScope.user = data;
	});

	Socket.emit('change:room', $scope.app_id);

	Socket.on('change:room', function(data) {
		console.log('change:room');
	});

	$scope.$on('$destroy', function(event) {
		Socket.disconnect(true);
	});
}]);