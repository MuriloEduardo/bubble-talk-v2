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
      templateUrl: 'views/sua-conta.html'
    })

    .state('novoChat', {
      url: '/novo-chat',
      templateUrl: 'views/novo-chat.html',
      controller: 'novoChatCtrl'
    })

    .state('app', {
      url: '/:app_id',
      redirectTo: 'app.dashboard',
      templateUrl: 'views/app.html',
      controller: 'appCtrl',
      resolve: {
        Chat: function(Api, $stateParams){
          return Api.getChat($stateParams.app_id);
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
      redirectTo: 'app.equipe.listaAgente',
      templateUrl: 'views/equipe.html',
      controller: 'equipeCtrl'
    })
    
    .state('app.equipe.novoAgente', {
      url: '/novo-agente',
      templateUrl: 'views/novo-agente.html',
      controller: 'novoAgenteCtrl'
    })
    
    .state('app.equipe.listaAgente', {
      url: '/',
      templateUrl: 'views/lista-agente.html',
      controller: 'listaAgenteCtrl',
      resolve: {
        Users: function ($http, $stateParams){
          return $http.get('/api/user/' + $stateParams.app_id).then(function(res){
            return res.data;
          })
        }
      }
    })

    .state('app.configuracao', {
      url: '/configuracao',
      templateUrl: 'views/configuracao.html',
      controller: 'configuracaoCtrl'
    })

  $locationProvider.html5Mode(true).hashPrefix('!');
}]);