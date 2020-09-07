const express = require('express');
const router = express.Router();
const controller = require('../controllers/login-controller');
const authService = require('../services/auth-service');

router.post('/', controller.authenticate);
router.post('/refresh-token', authService.authorize, controller.refreshToken);

module.exports = router;