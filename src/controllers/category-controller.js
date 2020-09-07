const validator = require('../validators/validator');
const repository = require('../repositories/category-repository');

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
            errors: contract.errors()
        }).end();
        return;
    }

    if (await repository.exists(req.body.description)) {
        res.status(200).send({
            sucess: false,
            message: 'A categoria informada já está cadastrada.'
        }).end();
        return;
    }

    try {
        await repository.create({
            description: req.body.description
        })
        res.status(201).send({
            sucess: true,
            message: 'Categoria cadastrada com sucesso.'
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
                errors: contract.errors()
            }).end();
            return;
        }

        await repository.update(req.params.id, req.body);
        res.status(201).send({
            sucess: true,
            message: 'Categoria atualizada com sucesso.'
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
        await repository.delete(req.body.id)
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
    contract.hasMinLen(category.description, 3, 'A descrição deve ter pelo menos 3 caracteres');
    return contract.isValid();
}