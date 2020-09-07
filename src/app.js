const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();

//Conecta ao banco
mongoose.connect(config.connectionString);

//Carrega os Models
const Seller = require('./models/seller');
const Category = require('./models/category');
const User = require('./models/user');
const Transaction = require('./models/transaction');

//Carrega as Rotas
const index = require('./routes/index-route');
const login = require('./routes/login-route');
const register = require('./routes/register-route');
const seller = require('./routes/seller-route');
const user = require('./routes/user-route');
const category = require('./routes/category-route');
const transaction = require('./routes/transaction-route');
const dailySummary = require('./routes/daily-summary-route');

app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    extended : false
}));

// Adiciona as regras para os headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/',index);
app.use('/v1/login',login);
app.use('/v1/register',register);
app.use('/v1/users',user);
app.use('/v1/sellers',seller);
app.use('/v1/categories',category);
app.use('/v1/transactions',transaction);
app.use('/v1/daily-summary',dailySummary);

module.exports = app;