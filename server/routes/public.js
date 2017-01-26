var Usuario = require('../models/usuario').Usuario;
var Token = require('../models/usuario').Token;
var path = require('path');

module.exports = function(router, passport){
	
	/*router.use(function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		res.redirect('/login');
	});*/

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
		Usuario.findOne({_id: req.params.id}, function(err, user){
			if(err) throw err;
			res.render('./site/confirmacao.ejs', {user: {_id: user._id, email: user.local.email}});
		})
	});
	
	// CONFIRMAÇÃO DE SENHA
	router.post('/confirmacao', function(req, res){
		Usuario.findOne({'_id': req.body.id}, function(err, data){
			if(!data){
				// Id da url nao encontrado
				res.json({res: 404});
			}else if(data.local.senha){
				// Senha ja cadastrada
				res.redirect('/app');
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
						res.redirect('/app');
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
			
			req.user = user;
			res.redirect('/app/sua-conta');
		});
	});

	router.get('/testToken', function(req, res){
		Usuario.findOne({_id: req.user._id}).populate('token').exec(function(err, user) {
			res.json(user);
		});
	});
	
	router.get('/widget', function(req, res){
		res.sendFile(path.join(__dirname, '../../public', 'cliente/init.js'));
	});
};