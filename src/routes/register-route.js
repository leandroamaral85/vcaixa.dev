const express = require('express');
const router = express.Router();
const controller = require('../controllers/register-controller');

router.post('/', controller.post);

module.exports = router;