app.controller('novoChatCtrl', ['$scope', 'Api', '$state', '$timeout', function($scope, Api, $state, $timeout){
	$scope.newChat = function(chat, $event) {
		$event.preventDefault();
		Api.newChat(chat)
		console.log(chat)
		.then(function(chat) {
			if(err) throw err;
			console.log(chat)
		})
		.catch(function(data, status) {
			console.error('novoChatCtrl Gists error');
		})
		.finally(function() {
			console.log("novoChatCtrl finally finished gists");
			$state.go('app', {id: chat.data._id}, {reload : true});
		});
	}
}]);