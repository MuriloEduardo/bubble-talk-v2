app.controller('equipeCtrl', ['$scope', 'Users', function($scope, Users){
    
    $scope.equipe = Users.data;
}]);