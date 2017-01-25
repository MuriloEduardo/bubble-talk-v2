app.controller('novoChatCtrl', ['$scope', 'Api', '$state', '$timeout', function($scope, Api, $state, $timeout){
	$scope.newChat = function(chat) {
		console.log("novoChatCtrl finally finished gists");
		Api.newChat(chat).success(function(name) {
		  console.log("Your name is: " + name);
		}).error(function(response, status) {
		  console.log("The request failed with response " + response + " and status code " + status);
		});
	}
}]);