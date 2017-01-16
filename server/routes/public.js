var Usuario = require('../models/usuario').Usuario;
var Token = require('../models/usuario').Token;
var isLoggedIn = require('../models/isLoggedIn');

module.exports = function(router, passport){

	////////////////////////////////////////////
	// Public           ///////////////////////
	//////////////////////////////////////////
	
	// Home - One Page //
	router.get('/', function(req, res){
		res.render('./site/index.ejs');
	});
	
	// Login
	router.get('/login', function(req, res){
		res.render('./site/login.ejs', {message_login: req.flash('loginAviso')});
	});
	
	// Confirmação
	// Convido para ser administrador receberá link para cá
	// para cadastrar sua senha
	// @param id client sem senha
	router.get('/confirmacao/:id', function(req, res){
		res.render('./site/confirmacao.ejs', {id: req.params.id});
	});

	router.get('/confirmacao', function(req, res){
		Usuario.findOne({_id: req.body.id}, function(err, data){
			if(!data){
				// Id da url nao encontrado
				res.json({res: 404});
			}else if(data.local.senha){
				// Senha ja cadastrada
				res.json({res: false});
			} else{
				var newUser = data;
				newUser.local = {
					email: data.local.email, 
					senha: Usuario().generateHash(req.body.senha)
				};

				newUser.save(function(err, data2){
					if(err){
						throw err;
					}else{
						// Efetuar login
						res.json({res: data2});
					}
				});
			}
		});
	});
	
	// Landing
	router.get('/experimente-gratis', function(req, res){
		res.render('./site/cadastrar.ejs', {message_cadastrar: req.flash('cadastrarAviso')});
	});
	
	// Volte Sempre
	router.get('/volte-sempre', function(req, res){
		res.render('./site/volte-sempre.ejs');
	});

	router.get('/get-token', function(req, res){
		Usuario.findOne({_id: req.user._id}).populate('token').exec(function(err, user) {
			if(user.token==null)
				user.generateToken();
			res.redirect('/testToken');
		});
	});

	router.get('/testToken', function(req, res){
		Usuario.findOne({_id: req.user._id}).populate('token').exec(function(err, user) {
			res.json(user);
		});
	});
	
	//////////////////////////////////////////////
	// ADMIN        /////////////////////////////
	////////////////////////////////////////////
	
	router.get('/app/*', isLoggedIn, function(req, res){
		res.render('./app/index.ejs', {
			_id: req.user._id,
			nome: req.user.nome, 
			foto_perfil: req.user.foto_perfil
		});
	});
};