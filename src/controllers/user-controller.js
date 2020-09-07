const validator = require('../validators/validator');
const repository = require('../repositories/user-repository');
const sellerRepository = require('../repositories/seller-repository');
const md5 = require('md5');

exports.get = async (req, res, next) => {
    try {
        let data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Erro ao buscar usuários: ' + e.message
        });
    }
};

exports.getById = async (req, res, next) => {
    try {
        let data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Erro ao buscar usuário: ' + e.message
        });
    }
};

exports.post = async (req, res, next) => {
    let contract = new validator();
    if (!validate(req.body, contract)) {
        res.status(400).send({
            sucess: false,
            errors: contract.errors()
        }).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        })
        res.status(201).send({
            sucess: true,
            message: 'Usuário cadastrado com sucesso.'
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao cadastrar usuário: ' + e.message
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        let contract = new validator();
        if (!validate(req.body, contract)) {
            res.status(400).send({
                sucess: false,
                errors: contract.errors()
            }).end();
            return;
        }

        await repository.update(req.params.id, req.body);
        res.status(201).send({
            sucess: true,
            message: 'Usuário atualizado com sucesso.'
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao atualizar os dados do usuário: ' + e.message
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id)
        res.status(200).send({
            sucess: true,
            message: 'Usuário excluído com sucesso.'
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao excluir usuário: ' + e.message
        });
    }
};

function validate(user, contract) {
    contract.hasMinLen(user.name, 3, 'O nome deve ter pelo menos 3 caracteres');
    contract.isEmail(user.email, 'E-mail inválido');
    contract.hasMinLen(user.password, 6, 'A senha deve ter pelo menos 6 caracteres');
    return contract.isValid();
}