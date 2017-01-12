app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

    .state('apps', {
      url: '/',
      templateUrl: 'views/apps.html',
      controller: 'appsCtrl'
    })

    .state('suaConta', {
      url: '/sua-conta',
      templateUrl: 'views/suaConta.html'
    })

    .state('novoChat', {
      url: '/novo-chat',
      templateUrl: 'views/novoChat.html'
    })

    .state('app', {
      url: '/:id',
      redirectTo: 'app.dashboard',
      templateUrl: 'views/app.html',
      controller: 'appCtrl'
    })

    .state('app.dashboard', {
      url: '',
      templateUrl: 'views/dashboard.html',
      controller: 'dashboardCtrl'
    })

    .state('app.conversas', {
      url: '/conversas',
      templateUrl: 'views/conversas.html',
      controller: 'conversasCtrl'
    })

    .state('app.equipe', {
      url: '/equipe',
      templateUrl: 'views/equipe.html',
      controller: 'equipeCtrl'
    })

  $locationProvider.html5Mode(true).hashPrefix('!');
});