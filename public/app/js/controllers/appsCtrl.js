app.controller('appsCtrl', ['$scope', '$rootScope', 'Chats', function($scope, $rootScope, Chats){
	$scope.chats = Chats.data;
}]);