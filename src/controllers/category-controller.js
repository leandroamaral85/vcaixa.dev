const validator = require('../validators/validator');
const repository = require('../repositories/category-repository');
const transactionRepository = require('../repositories/transaction-repository');

exports.get = async (req, res) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Erro ao buscar categorias: ' + e.message
        });
    }
};

exports.getById = async (req, res) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Erro ao buscar categorias: ' + e.message
        });
    }
};

exports.post = async (req, res) => {
    let contract = new validator();
    if (!validate(req.body, contract)) {
        res.status(400).send({
            sucess: false,
            message: contract.errors()
        }).end();
        return;
    }

    if (await repository.exists(req.body.name)) {
        res.status(200).send({
            sucess: false,
            message: 'A categoria informada já está cadastrada.'
        }).end();
        return;
    }

    try {
        let category = await repository.create(req.body)
        res.status(201).send({
            sucess: true,
            message: 'Categoria cadastrada com sucesso.',
            data: category
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao cadastrar categoria: ' + e.message
        });
    }
};

exports.put = async (req, res) => {
    try {
        let contract = new validator();
        if (!validate(req.body, contract)) {
            res.status(400).send({
                sucess: false,
                message: contract.errors()
            }).end();
            return;
        }

        let category = await repository.update(req.params.id, req.body);
        res.status(201).send({
            sucess: true,
            message: 'Categoria atualizada com sucesso.',
            data: category
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao atualizar os dados da categoria: ' + e.message
        });
    }
};

exports.delete = async (req, res) => {
    try {
        let hasTransactions = await transactionRepository.categoryHasTransactions(req.params.id);
        if (hasTransactions) {
            res.status(400).send({
                sucess: false,
                message: 'Esta categoria não pode ser excluída pois existem movimentações associadas a mesma.'
            }).end();
            return; 
        } 

        await repository.delete(req.params.id)
        res.status(200).send({
            sucess: true,
            message: 'Categoria excluída com sucesso.'
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao excluir categoria: ' + e.message
        });
    }
};

function validate(category, contract) {
    contract.hasMinLen(category.name, 3, 'O nome da categoria deve ter pelo menos 3 caracteres');
    return contract.isValid();
}