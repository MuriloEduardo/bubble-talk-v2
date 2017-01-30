app.controller('novoAgenteCtrl', ['$scope', 'Api', function($scope, Api){
	
	$scope.createNewAgente = function(email) {
        Api.newUser({email: email, app_id: $scope.Chat._id}).then(function(res){
            $scope.email = undefined;
            console.log(res.data)
            if(res.data.existe) {
                // email ja existente
                // Notification.error('<b>Putz!</b> Email já existente.');
                console.log('email ja existente')
            } else {
                $scope.equipe.push(res.data);
                // Notification.success('<b>Uhuu!</b> Administrador cadastrado com sucesso! Ele receberá um email, lembre-o disso.');
            }
        });
    }
}]);