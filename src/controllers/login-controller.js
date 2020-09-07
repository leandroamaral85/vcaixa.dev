const userRepository = require('../repositories/user-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');
const sellerRepository = require('../repositories/seller-repository');

exports.authenticate = async (req, res, next) => {
    try {
        const user = await userRepository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
        });

        if (!user) {
            res.status(401).send({
                sucess: false,
                message: 'E-mail ou senha inválidos.'
            });
            return;
        }

        const token = await authService.generateToken({
            id: user._id,
            email: user.email,
            name: user.name,
            roles: user.roles
        });

        let userSeller = await sellerRepository.getById(user.seller);

        res.status(200).send({
            sucess: true,
            username: user.email,
            name: user.name,
            email: user.email,
            token: token,
            seller: userSeller
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao autenticar usuário: ' + e.message
        });
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);
        const user = await userRepository.getById(data.id);

        if (!user) {
            res.status(401).send({
                sucess: false,
                message: 'Usuário não encontrado.'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: user._id,
            email: user.email,
            name: user.name,
            roles: user.roles
        })

        res.status(200).send({
            sucess: true,
            token: token,
            data: {
                email: user.email,
                name: user.name
            }
        });
    } catch (e) {
        res.status(400).send({
            sucess: false,
            message: 'Falha ao atualizar token: ' + e.message
        });
    }
};