app.controller('mainCtrl', ['$scope', '$rootScope', '$state', 'Api', function($scope, $rootScope, $state, Api){

		// Retirna os carcteries criados pelo callback do facebook
		// É uma gambi, pois acredito que para retornar esta string, é por que ainda esta local
		// Provisorio
		window.history.pushState("", document.title, window.location.pathname);

		// Variavel com todos os dados do usuario
		Api.User(window.uid).then(function(User){
			$rootScope.user = User.data;
			// Se usuario for convidado
			// Manda para tela de perfil para ser cadastrado informações minimas
			if(!User.data.nome) $state.go('suaConta');
		});
}]);