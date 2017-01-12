// var Chat = require('../models/chat');
module.exports = function(router) {
	// CRIAR UM NOVO CHAT //
	/*router.post('/create', function(req, res){

		Chat.findOne({'dados.appname': req.body.dados.appname}, function(err, data){
			// Appname nao encontrado, entao nao existe
			// Deverá e será unico
			if(!data){
				var novoChat   = new Chat();
				novoChat.dados = req.body.dados;
				novoChat.administradores.push(req.user._id);
				novoChat.criador = req.user._id;

				novoChat.save(function(err, data){
					if(err){
						throw err;
					}else{

						var propriedadeUsuario = req.user;
						propriedadeUsuario.novoChat.push(data._id);

						propriedadeUsuario.save(function(err){
							if(err){
								throw err;
							}else{
								res.json(data);
							}
						});
					}
				});
			}else{
				// Appname encontrado
				res.json({err: true});
			}
		});
	});*/
}