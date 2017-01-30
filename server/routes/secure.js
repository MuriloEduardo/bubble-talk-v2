var Usuario = require('../models/usuario');

module.exports = function(router, passport){
	
	//////////////////////////////////////////////
	// INTERNO      /////////////////////////////
	////////////////////////////////////////////
	
	router.use(function(req, res, next){
		if(req.isAuthenticated()) return next();
		res.redirect('/login');
	});
	
	router.get('/*', function(req, res){
		Usuario.findOne({ _id: req.user._id }).populate('token').exec(function(err, user){
			res.render('./app/index.ejs', {
				_id: req.user._id,
				nome: req.user.nome, 
				foto_perfil: req.user.foto_perfil
			});
		});
	});
};