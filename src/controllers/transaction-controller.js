const validator = require('../validators/validator');
const repository = require('../repositories/transaction-repository');
const authService = require('../services/auth-service');
const userRepository = require('../repositories/user-repository');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Erro ao buscar movimentações: ' + e.message
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
            message: 'Erro ao buscar movimentações: ' + e.message
        });
    }
};

exports.post = async (req, res, next) => {
    await getSeller(req);

    let contract = new validator();
    if (!validate(req.body, contract)) {
        res.status(400).send({
            sucess: false,
            errors: contract.errors()
        }).end();
        return;
    }

    try {
        let transaction = await repository.create(req.body);
        res.status(201).send({
            sucess: true,
            message: 'Movimentação cadastrada com sucesso.',
            data: transaction
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao cadastrar movimentação: ' + e.message
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        await getSeller(req);

        let contract = new validator();
        if (!validate(req.body, contract)) {
            res.status(400).send({
                sucess: false,
                message: contract.errors()
            }).end();
            return;
        }

        let oldTransaction = await repository.getById(req.params.id);
        if (!oldTransaction.seller === req.body.seller) {
            res.status(400).send({
                sucess: false,
                message: 'Esta movimentação pertence a outra empresa.'
            }).end();
            return;            
        }

        let transaction = await repository.update(req.params.id, req.body);
        res.status(201).send({
            sucess: true,
            message: 'Movimentação atualizada com sucesso.',
            data: transaction
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao atualizar os dados da movimentação: ' + e.message
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        await getSeller(req);
                
        let oldTransaction = await repository.getById(req.params.id);
        if (!oldTransaction.seller === req.body.seller) {
            res.status(400).send({
                sucess: false,
                message: 'Esta movimentação pertence a outra empresa.'
            }).end();
            return;            
        }

        await repository.delete(req.params.id)
        res.status(200).send({
            sucess: true,
            message: 'Movimentação excluída com sucesso.'
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao excluir movimentação: ' + e.message
        });
    }
};

async function getSeller(req) {
    let tokenData = await authService.getTokenData(req.header('x-access-token'));
    let user = await userRepository.getById(tokenData.id);
    req.body.seller = user.seller;
}

function validate(transaction, contract) {
    contract.isRequired(transaction.category, 'A categoria é de preenchimento obrigatório.');
    contract.isRequired(transaction.seller, 'A empresa é de preenchimento obrigatório.');
    contract.hasFixedValue(transaction.type, ['ENTRADA', 'SAIDA'], 'O tipo da transação deve ser ENTRADA ou SAIDA.')
    contract.hasMinLen(transaction.description, 3, 'A descrição deve ter pelo menos 3 caracteres');
    contract.maiorQueZero(transaction.value, 'O valor da transação deve ser maior do que zero');
    return contract.isValid();
}