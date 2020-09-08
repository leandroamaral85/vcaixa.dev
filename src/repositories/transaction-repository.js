const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const Moment = require('moment');

exports.get = async () => {
    return await Transaction.find();
};

exports.getById = async (id) => {
    return await Transaction.findById(id);
};

exports.getDailySummary = async (seller) => {
    let balance = 0;
    let data = await Transaction.find({
        date: {
            $gte: new Moment().format('YYYY-MM-DD'),
            $lte: new Moment().format('YYYY-MM-DD')
        },
        seller: seller
    }).populate('category');

    if (data.length > 0) {
        balance = data.reduce((sum, reg) => {
            if (reg.type === 'ENTRADA') {
                return sum + reg.value;
            } else {
                return sum - reg.value;
            }
        }, 0);
    } 

    return {
        totalBalance: balance,
        transactions:  data
    }    
};

exports.create = async (data) => {
    return await new Transaction(data).save();
};

exports.update = async (id, data) => {
    await Transaction
        .findByIdAndUpdate(id, data);
    return this.getById(id);
};

exports.delete = async (id) => {
    await Transaction.findOneAndRemove(id);
};