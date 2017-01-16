var Usuario    = require('../models/usuario');
var isLoggedIn = require('../models/isLoggedIn');
module.exports = function(router, passport) {
	
	// CADASTRAR UM NOVO USUARIO
	router.post('/experimente-gratis', passport.authenticate('local-signup', {
		successRedirect: '/app',
		failureRedirect: '/experimente-gratis',
		failureFlash: true
	}));

	// EFETUA O LOGIN APARTIR DE EMAIL E SENHA //
	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/app',
		failureRedirect: '/login',
		failureFlash: true
	}),function(req, res) {
		return
		if (req.body.remember) {
			req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
		} else {
			req.session.cookie.expires = false; // Cookie expires at end of session
		}
		res.redirect('/');
	});

	// LOGOUT //
	router.get('/logout', isLoggedIn, function(req, res){
		req.logout();
		res.redirect('/volte-sempre');
	});

	// Facebook Passport Auth
	router.get('/facebook', passport.authenticate('facebook', {scope: ['email'], authType: 'rerequest'}));
	router.get('/facebook/callback', passport.authenticate('facebook', {successRedirect: '/app/sua-conta', failureRedirect: '/login'}));

	// Google Passport Auth
	router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
	router.get('/google/callback', passport.authenticate('google', {successRedirect: '/app/sua-conta', failureRedirect: '/login'}));

	router.get('/connect/facebook', passport.authorize('facebook', {scope: ['email']}));

	router.get('/connect/google', passport.authorize('google', {scope: ['profile', 'email']}));

	router.get('/connect/local', function(req, res) {
		res.render('./site/connect-local.ejs', {message: req.flash('signupMessage')});
	});

	router.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect: '/app/sua-conta',
		failureRedirect: '/connect/local',
		failureFlash: true
	}));

	router.get('/unlink/facebook', function(req, res) {
		var user = req.user;
		user.facebook = {};
		user.save(function(err) {
			if(err)
				return err;
			res.redirect('/app/sua-conta');
		})
	});

	router.get('/unlink/google', function(req, res) {
		var user = req.user;
		user.google = {};
		user.save(function(err) {
			if(err)
				return err;
			res.redirect('/app/sua-conta');
		})
	});
}