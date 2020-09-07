const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    registeredNumber: {
        type: String,
        required: true,
        unique: true
    },
});

module.exports = mongoose.model('Seller', schema);