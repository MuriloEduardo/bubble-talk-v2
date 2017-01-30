app.factory('Api', ['$http', function($http){

	/////////////////////////////////////////////////////////
	///////////////// USUARIO //////////////////////////////
	///////////////////////////////////////////////////////

	var _newUser = function(user) {
		return $http.post('/api/user', user);	
	}
	
	var _getUser = function(user_id) {
		return $http.get('/api/user/' + user_id);
	}
	
	var _getUsers = function(app_id) {
		return $http.get('/api/users/' + app_id);
	}

	/////////////////////////////////////////////////
	///////////////// CHAT /////////////////////////
	///////////////////////////////////////////////

	var _getAllChats = function() {
		return $http.get('/api/chat');
	};
	
	var _newChat = function(chat) {
		return $http.post('/api/chat', chat);
	};

	var _getChat = function(app_id) {
		return $http.get('/api/chat/' + app_id);
	}

	var _delChat = function(app_id) {
		return $http.delete('/api/chat/' + app_id);
	}

	return {
		newChat: _newChat,
		Chats: _getAllChats,
		getChat: _getChat,
		delChat: _delChat,

		newUser: _newUser,
		User: _getUser,
		Users: _getUsers
	};
}]);