const validator = require('../validators/validator');
const repository = require('../repositories/transaction-repository');
const categoryRepository = require('../repositories/category-repository');
const sellerRepository = require('../repositories/seller-repository');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Erro ao buscar transações: ' + e.message
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
            message: 'Erro ao buscar transações: ' + e.message
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
        await repository.create(req.body);
        res.status(201).send({
            sucess: true,
            message: 'Transação cadastrada com sucesso.'
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao cadastrar transação: ' + e.message
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
            message: 'Transação atualizada com sucesso.'
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao atualizar os dados do transação: ' + e.message
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id)
        res.status(200).send({
            sucess: true,
            message: 'Transação excluída com sucesso.'
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao excluir transação: ' + e.message
        });
    }
};

function validate(transaction, contract) {
    contract.isRequired(transaction.category, 'A categoria é de preenchimento obrigatório.');
    contract.isRequired(transaction.seller, 'A empresa é de preenchimento obrigatório.');
    contract.hasFixedValue(transaction.type, ['ENTRADA', 'SAIDA'], 'O tipo da transação deve ser ENTRADA ou SAIDA.')
    contract.hasMinLen(transaction.description, 3, 'A descrição deve ter pelo menos 3 caracteres');
    contract.maiorQueZero(transaction.value, 'O valor da transação deve ser maior do que zero');
    return contract.isValid();
}