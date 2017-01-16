app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

    .state('apps', {
      url: '/',
      templateUrl: 'views/apps.html',
      controller: 'appsCtrl',
      resolve: {
        Chats: function (Api){
          return Api.Chats();
        }
      }
    })

    .state('suaConta', {
      url: '/sua-conta',
      templateUrl: 'views/suaConta.html'
    })

    .state('novoChat', {
      url: '/novo-chat',
      templateUrl: 'views/novoChat.html',
      controller: 'novoChatCtrl'
    })

    .state('app', {
      url: '/:id',
      redirectTo: 'app.dashboard',
      templateUrl: 'views/app.html',
      controller: 'appCtrl',
      resolve: {
        Chat: function(Api, $stateParams){
          return Api.getChat($stateParams.id);
        }
      }
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

    .state('app.configuracao', {
      url: '/configuracao',
      templateUrl: 'views/configuracao.html',
      controller: 'configuracaoCtrl'
    })

  $locationProvider.html5Mode(true).hashPrefix('!');
}]);