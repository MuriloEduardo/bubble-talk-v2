var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var BearerStrategy   = require('passport-http-bearer').Strategy;


var Usuario             = require('../models/usuario').Usuario;
var Token            = require('../models/usuario').Token;
var configAuth = require('./auth');

module.exports = function(passport) {

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		Usuario.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'senha',
		passReqToCallback: true
	}, function(req, email, senha, done){
			process.nextTick(function(){
				Usuario.findOne({'local.email': email}, function(err, user){
					if(err)
						return done(err);

					if(user)
						return done(null, false, req.flash('cadastrarAviso', 'Email existente'));

					if(!req.user) {
						var newUser = new Usuario();
						newUser.local.email = email;
						newUser.local.senha = newUser.generateHash(senha);

						newUser.save(function(err){
							if(err)
								throw err;
							return done(null, newUser);
						});
					} else {
						var user = req.user;
						user.local.email = email;
						user.local.senha = user.generateHash(senha);

						user.save(function(err){
							if(err)
								throw err;
							return done(null, user);
						});
					}
				});
			});
		}
	));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'senha',
		passReqToCallback: true
	}, function(req, email, senha, done){
			process.nextTick(function(){
				Usuario.findOne({'local.email': email}, function(err, user){
					if(err)
						return done(err);
					if(!user){
						return done(null, false, req.flash('loginAviso', 'Usuário não encontrado'));
					}else{
						if(!user.local.senha)
							return done(null, false, req.flash('loginAviso', '<strong>Cadastro não confirmado!</strong> Configure sua nova senha <a href="/confirmacao/' + user._id + '" class="alert-click">clicando aqui</a>'));
					}
					if(!user.validPassword(senha))
						return done(null, false, req.flash('loginAviso', 'Senha inválida'));

					return done(null, user);
				});
			});
		}
	));

	passport.use(new FacebookStrategy({
	    clientID: configAuth.facebookAuth.clientID,
	    clientSecret: configAuth.facebookAuth.clientSecret,
	    callbackURL: configAuth.facebookAuth.callbackURL,
	    passReqToCallback: true,
	    profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'profileUrl', 'locale', 'timezone']
	  },
	  function(req, accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		if(!req.user){
	    			// Usuário ainda não fez logon
					Usuario.findOne({'facebook.id': profile.id}, function(err, user){
		    			if(err)
		    				return done(err);
		    			if(user){
		    				if(!user.facebook.token) {
			    				if(!user.nome) user.nome = profile._json.name;
		    					if(!user.foto_perfil) user.foto_perfil = profile._json.picture.data.url;

		    					user.facebook.id = profile._json.id;
		    					user.facebook.name = profile._json.name;
		    					user.facebook.picture = profile._json.picture.data.url;
		    					user.facebook.email = profile._json.email;
		    					user.facebook.gender = profile._json.gender;
		    					user.facebook.link = profile._json.link;
		    					user.facebook.locale = profile._json.locale;
		    					user.facebook.timezone = profile._json.timezone;
		    					user.facebook.token = accessToken;

		    					user.save(function(err){
		    						if(err)
		    							throw err;
		    					});
	    					}
		    				
		    				return done(null, user);
		    			} else {
		    				var newUser = new Usuario();
		    				newUser.nome = profile._json.name;
		    				newUser.foto_perfil = profile._json.picture.data.url;;

							newUser.facebook.id = profile._json.id;
							newUser.facebook.name = profile._json.name;
							newUser.facebook.picture = profile._json.picture.data.url;
							newUser.facebook.email = profile._json.email;
							newUser.facebook.gender = profile._json.gender;
							newUser.facebook.link = profile._json.link;
							newUser.facebook.locale = profile._json.locale;
							newUser.facebook.timezone = profile._json.timezone;
							newUser.facebook.token = accessToken;

		    				newUser.save(function(err){
		    					if(err)
		    						throw err;
		    					return done(null, newUser);
		    				})
		    			}
		    		});
	    		} else {
	    			// Usuário já está conectado e precisa ser mesclado
	    			var user = req.user;

	    			if(!user.nome) user.nome = profile._json.name;
					if(!user.foto_perfil) user.foto_perfil = profile._json.picture.data.url;

	    			user.facebook.id = profile._json.id;
					user.facebook.name = profile._json.name;
					user.facebook.picture = profile._json.picture.data.url;
					user.facebook.email = profile._json.email;
					user.facebook.gender = profile._json.gender;
					user.facebook.link = profile._json.link;
					user.facebook.locale = profile._json.locale;
					user.facebook.timezone = profile._json.timezone;
					user.facebook.token = accessToken;

	    			user.save(function(err){
	    				if(err)
	    					throw err;
	    				return done(null, user);
	    			})
	    		}
	    		
	    	});
	    }
	));

	passport.use(new GoogleStrategy({
	    clientID: configAuth.googleAuth.clientID,
	    clientSecret: configAuth.googleAuth.clientSecret,
	    callbackURL: configAuth.googleAuth.callbackURL,
	    passReqToCallback: true
	  },
	  function(req, accessToken, refreshToken, profile, done) {
	  	console.log(profile)
	    	process.nextTick(function(){

	    		if(!req.user){
	    			Usuario.findOne({'google.id': profile.id}, function(err, user){
		    			if(err)
		    				return done(err);
		    			if(user){
		    				if(!user.google.token){
		    					user.google.token = accessToken;
		    					user.google.name = profile.displayName;
		    					user.google.email = profile.emails[0].value;
		    					user.save(function(err){
		    						if(err)
		    							throw err;
		    					});
		    				}
		    				return done(null, user);
		    			}
		    			else {
		    				var newUser = new Usuario();
		    				newUser.google.id = profile.id;
		    				newUser.google.token = accessToken;
		    				newUser.google.name = profile.displayName;
		    				newUser.google.email = profile.emails[0].value;

		    				newUser.save(function(err){
		    					if(err)
		    						throw err;
		    					return done(null, newUser);
		    				})
		    			}
		    		});
	    		} else {
	    			var user = req.user;
	    			user.google.id = profile.id;
					user.google.token = accessToken;
					user.google.name = profile.displayName;
					user.google.email = profile.emails[0].value;

					user.save(function(err){
						if(err)
							throw err;
						return done(null, user);
					});
	    		}
	    		
	    	});
	    }
	));

	passport.use(new BearerStrategy({
		},
		function(token, done){
			Usuario.findOne({ _id: token }, function(err, user){
				if(!user)
					return done(null, false);
				return done(null, user);
			});
		}
	));

	passport.use(new BearerStrategy({}, function(token, done){
		Token.findOne({value: token}).populate('usuario').exec(function(err, token){
			if(!token)
				return done(null, false);
			return done(null, token.user);
		});
	}));
};