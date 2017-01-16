app.controller('configuracaoCtrl', ['$scope', 'Api', '$state', function($scope, Api, $state){
	$scope.delChat = function(app_id) {

		Api.delChat(app_id)
		.then(function(data) {
			console.log(data)
			$state.go('apps');
		})
		.catch(function(data, status) {
			console.error('configuracaoCtrl Gists error');
		})
		.finally(function() {
			console.log("configuracaoCtrl finally finished gists");
		});
	}
}]);