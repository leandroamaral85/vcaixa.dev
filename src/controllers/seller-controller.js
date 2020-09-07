const mongoose = require('mongoose');
const ValidatorContract = require('../validators/validator');
const repository = require('../repositories/seller-repository');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Erro ao buscar empresas: ' + e.message
        });
    }
};

exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Erro ao buscar empresa: ' + e.message
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        let contract = new ValidatorContract();
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
            message: 'Empresa atualizada com sucesso.'
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao atualizar os dados da empresa: ' + e.message
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id)
        res.status(200).send({
            sucess: true,
            message: 'Empresa excluida com sucesso.'
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao excluir empresa: ' + e.message
        });
    }
};

function validate(company, contract) {
    contract.hasMinLen(company.companyName, 3, 'A razão social deve ter pelo menos 5 caracteres');
    return contract.isValid();
}