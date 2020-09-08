const validator = require('../validators/validator');
const repository = require('../repositories/transaction-repository');
const userRepository = require('../repositories/user-repository');
const authService = require('../services/auth-service');

exports.get = async (req, res) => {
    try {
        let tokenData = await authService.getTokenData(req.header('x-access-token'));
        let user = await userRepository.getById(tokenData.id);
        let data = await repository.getDailySummary(user.seller);
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Erro ao buscar transações: ' + e.message
        });
    }
};