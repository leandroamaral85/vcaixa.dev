const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');

exports.get = async () => {
    return await Transaction.find();
};

exports.getById = async (id) => {
    return await Transaction.findById(id);
};

exports.getDailySummary = async (date, seller) => {
    let data = await Transaction.find({
        date: {
            $gte: new Date(date.getFullYear(), date.getMonth(), date.getDay())
        },
        seller: seller
    }).populate('category');

    let total = await Transaction.aggregate(
        [
            {
                $group:
                {
                    _id: "$type",
                    totalAmount: { $sum: "$value" }
                }
            }
        ]
    );

    let balance = total.reduce((sum, reg) => {
        if (reg._id === 'ENTRADA') {
            return sum + reg.totalAmount;
        } else {
            return sum - reg.totalAmount;
        }
    }, 0);

    return {
        totalBalance: balance,
        transactions: [
            data
        ]
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