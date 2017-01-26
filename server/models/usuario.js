var mongoose  = require('mongoose');
var bcrypt    = require('bcryptjs');
var randtoken = require('rand-token');
var Schema    = mongoose.Schema;

var usuarioSchema = mongoose.Schema({
	nome: String,
	foto_perfil: String,
	data_nascimento: Date,
	cpf: String,
	pagamento: {
		numero_cartao: Number,
		data_validade: String,
		codigo_seguranca: Number
	},
	local: {
		email: String,
		senha: String
	},
	facebook: {
		id: String,
		name: String,
		picture: String,
		email: String,
		gender: String,
		link: String,
		locale: String,
		timezone: String,
		token: String
	},
	token: {
		type: Schema.Types.ObjectId,
		ref: 'Token',
		default: null
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String,
		photo: String
	},
	data_cadastro: {type: Date, default: Date.now},
	bubbles: [],
	notificacoes: [],
	connected: {
		status: Boolean,
		date: {type: Date, default: Date.now}
	},
	conversas: [
		{
			socket_id: String,
			connected: {
				status: Boolean, 
				date: {type: Date, default: Date.now}
			},
			bubble_id: String,
			canal_atual: String,
			mensagens: [
				{
					mensagem: String,
					data: {type: Date, default: Date.now},
					visulizada: Boolean,
					remetente: Boolean
				}
			]
		}
	]
});

usuarioSchema.methods.generateToken = function() {
	var token = new Token();
	token.value = randtoken.generate(32);
	token.user = this._id;
	this.token = token._id;
	this.save(function(err) {
		if(err)
			throw err;
		token.save(function(err) {
			if(err)
				throw err;
		});
	});
};

var tokenSchema = mongoose.Schema({
	value: String,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario'
	},
	expireAt: {
		type: Date,
		expires: 60,
		default: Date.now
	}
});

usuarioSchema.methods.generateHash = function(senha){
	return bcrypt.hashSync(senha, bcrypt.genSaltSync(9));
}

usuarioSchema.methods.validPassword = function(senha){
	return bcrypt.compareSync(senha, this.local.senha);
}

var Usuario = mongoose.model('Usuario', usuarioSchema);
var Token = mongoose.model('Token', tokenSchema);
var Models = {Usuario: Usuario, Token: Token};

module.exports = Models;