const mongoose = require('mongoose');
const validator = require('../validators/validator');
const sellerRepository = require('../repositories/seller-repository');
const userRepository = require('../repositories/user-repository');
const md5 = require('md5');

exports.post = async (req, res, next) => {
	try {
		let contract = new validator();
		if (!validateCompany(req.body.company, contract)) {
			res.status(200).send({
				sucess: false,
				message: contract.errors()
			}).end();
			return;
		}

		if (!validateUser(req.body.user, contract)) {
			res.status(200).send({
				sucess: false,
				message: contract.errors()
			}).end();
			return;
		}

		if (await sellerRepository.exists(req.body.company.registeredNumber)) {
			res.status(200).send({
				sucess: false,
				message: 'Esta empresa já está cadastrada. Por favor, verifique o CNPJ informado.'
			}).end();
			return;
		}

		if (await userRepository.exists(req.body.user.email)) {
			res.status(200).send({
				sucess: false,
				message: 'O e-mail informado já está cadastrado para outra empresa. Por favor, verifique o e-mail informado.'
			}).end();
			return;
		}

		// Cria a empresa
		await sellerRepository.create(req.body.company);
		var newSeller = await sellerRepository.getByRegisteredNumber(req.body.company.registeredNumber);
		if (!newSeller) {
			throw new Error('Não foi possível cadastrar a empresa.');
		}

		// Cria o usuário
		let user = {
			name: req.body.user.name,
			email: req.body.user.email,
			password: md5(req.body.user.password + global.SALT_KEY),
			seller: newSeller._id
		};
		await userRepository.create(user);

		// Retorna a resposta
		res.status(201).send({
			sucess: true,
			message: 'Empresa cadastrada com sucesso.'
		});
	} catch (e) {
		res.status(200).send({
			sucess: false,
			message: 'Falha ao cadastrar empresa: ' + e.message
		});
	}
};

function validateCompany(company, contract) {
	contract.isRequired(company.companyName, 'A razão social é obrigatória');
	contract.isRequired(company.registeredNumber, 'O CNPJ é obrigatório');
	return contract.isValid();
}

function validateUser(user, contract) {
	contract.hasMinLen(user.name, 3, 'O nome deve ter pelo menos 3 caracteres');
	contract.isEmail(user.email, 'E-mail inválido');
	contract.hasMinLen(user.password, 6, 'A senha deve ter pelo menos 6 caracteres');
	return contract.isValid();
}
