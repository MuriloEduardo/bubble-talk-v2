var app = angular.module('bubbleApp', ['ui.router', 'ui-notification', 'btford.socket-io'])

.run(['$rootScope', '$state', '$urlRouter', function($rootScope, $state, $urlRouter) {
	
	$rootScope.$on('$stateChangeStart', function(evt, to, params) {
	  if (to.redirectTo) {
	    evt.preventDefault();
	    $state.go(to.redirectTo, params, {location: 'replace'})
	  } else {
	  	$rootScope.showDialog = true;
	  }
	});

	$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
		$rootScope.showDialog = false;
	});
	
	$urlRouter.listen();
}])

.config(['$qProvider', '$urlRouterProvider', function ($qProvider, $urlRouterProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $urlRouterProvider.deferIntercept();
}]);