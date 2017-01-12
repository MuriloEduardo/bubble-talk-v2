var app = angular.module('bubbleApp', ['ui.router', 'btford.socket-io']);
	app.run(['$rootScope', '$state', function($rootScope, $state) {
	    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
	      if (to.redirectTo) {
	        evt.preventDefault();
	        $state.go(to.redirectTo, params, {location: 'replace'})
	      }
	    });
	}]);