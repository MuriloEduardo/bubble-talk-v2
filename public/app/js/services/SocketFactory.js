app.factory('Socket', ['socketFactory', '$stateParams', function(socketFactory, $stateParams) {
	return socketFactory({app_id: $stateParams.id});
}]);