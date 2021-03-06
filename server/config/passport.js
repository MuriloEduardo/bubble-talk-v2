var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var Usuario          = require('../models/usuario');
var configAuth		 = require('./auth');

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
				Usuario.findOne({$or:[
					{'local.email': email},
					{'facebook.email': email},
					{'google.email': email}
				]}, function(err, user){
					if(err)
						return done(err);

					if(user)
						return done(null, false, req.flash('cadastrarAviso', 'Email já existente'));

					if(!req.user) {
						var newUser = new Usuario();
						newUser.local.email = email;
						newUser.local.senha = newUser.generateHash(senha);

						newUser.save(function(err){
							if(err)
								throw err;
							return done(null, newUser);
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
				Usuario.findOne({$or:[
					{'local.email': email},
					{'facebook.email': email},
					{'google.email': email}
				]}, function(err, user){
					if(err)
						return done(err);
					if(!user){
						return done(null, false, req.flash('loginAviso', 'Usuário não encontrado, cadastre-se <a href="/experimente-gratis" class="text-danger">aqui</a>'));
					}else{
						if(!user.local.senha) {
							if(senha){
								// Cadastrar nova senha
								user.local = {
									email: email, 
									senha: Usuario().generateHash(senha)
								};

								user.save(function(err){
									if(err)
										throw err;
									return done(null, false, user);
									console.log('porrrrrrrrrraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
								});
							} else {
								return done(null, false, req.flash('loginAviso', 'Configure sua nova senha <a href="/confirmacao/' + user._id + '" class="text-danger alert-click"><b>aqui</b></a>'));
							}
						}
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
    			// Usuário ainda não fez logon
				Usuario.findOne({$or:[
					{'facebook.id': profile.id},
					{'local.email': profile._json.email}
				]}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user){
	    				
	    				if(!user.facebook.token) {
		    				user.nome			   = profile._json.name;
	    					user.foto_perfil	   = profile._json.picture.data.url;

	    					user.facebook.id       = profile._json.id;
	    					user.facebook.name	   = profile._json.name;
	    					user.facebook.picture  = profile._json.picture.data.url;
	    					user.facebook.email    = profile._json.email;
	    					user.facebook.gender   = profile._json.gender;
	    					user.facebook.link     = profile._json.link;
	    					user.facebook.locale   = profile._json.locale;
	    					user.facebook.timezone = profile._json.timezone;
	    					user.facebook.token    = accessToken;

	    					user.save(function(err){
	    						if(err) throw err;
	    					});
    					}
	    				
	    				return done(null, user);
	    			} else {
	    				
	    				var newUser 			  = new Usuario();
	    				newUser.nome			  = profile._json.name;
	    				newUser.foto_perfil 	  = profile._json.picture.data.url;;

						newUser.facebook.id 	  = profile._json.id;
						newUser.facebook.name	  = profile._json.name;
						newUser.facebook.picture  = profile._json.picture.data.url;
						newUser.facebook.email	  = profile._json.email;
						newUser.facebook.gender	  = profile._json.gender;
						newUser.facebook.link	  = profile._json.link;
						newUser.facebook.locale   = profile._json.locale;
						newUser.facebook.timezone = profile._json.timezone;
						newUser.facebook.token	  = accessToken;

	    				newUser.save(function(err){
	    					if(err) throw err;
	    					return done(null, newUser);
	    				});
	    			}
	    		});
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
	    	process.nextTick(function(){
	    		Usuario.findOne({$or:[
					{'google.id': profile.id},
					{'local.email': profile.emails[0].value}
				]}, function(err, user){
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
	    	});
	    }
	));
};