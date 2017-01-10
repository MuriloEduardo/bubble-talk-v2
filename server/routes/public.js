module.exports = function(router){
	
	///////////////////////////////////////
	//              Site                //
	/////////////////////////////////////
	router.get('/', function(req, res){
		res.render('./site/index.ejs');
	});

	router.get('/login', function(req, res){
		res.render('./site/login.ejs');
	});

	///////////////////////////////////////
	//            Aplicação             //
	/////////////////////////////////////
	router.get('/app/:app_id?/:partial?', function(req, res){
		res.render('./app/index.ejs');
	});
};