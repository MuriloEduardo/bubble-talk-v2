app.controller('novoChatCtrl', ['$scope', 'Api', '$state', '$timeout', function($scope, Api, $state, $timeout){
	$scope.newChat = function(chat) {
		Api.newChat(chat).then(function(res) {
			if(res.status==200)
				$state.go('apps');
		});
	}
}]);