var mongoose = require('mongoose');
var randtoken = require('rand-token');
var Schema    = mongoose.Schema;

var chatSchema = mongoose.Schema({
	dados: {
		appname: String,
		termos: Boolean,
		telefone: String,
		endereco: {
			cep: Number,
			logradouro: String,
			numero: Number,
			complemento: String,
			bairro: String,
			cidade: String,
			estado: String
		},
		data_cadastro: {type: Date, default: Date.now}
	},
	criador: String,
	token: {
		value: {
			type: String,
			default: randtoken.generate(32)
		},
		expireAt: {
			type: Date,
			expires: 60,
			default: Date.now
		}
	},
	administradores: [],
	conversas: [
		{
			socket_id: String,
			connected: {status: Boolean, date: Date},
			mensagens: [
				{
					mensagem: String,
					data: {type: Date},
					visulizada: Boolean,
					remetente: Boolean
				}
			]
		}
	]
});

module.exports = mongoose.model('Chat', chatSchema);