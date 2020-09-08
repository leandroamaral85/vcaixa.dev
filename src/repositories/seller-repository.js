const mongoose = require('mongoose');
const Seller = mongoose.model('Seller');

exports.get = async () => {
    return await Seller.find();
};

exports.getById = async (id) => {
    return await Seller.findById(id);
};

exports.getByRegisteredNumber = async (regNumber) => {
    return await Seller.findOne({
        registeredNumber: regNumber
    }, '_id companyName');
};

exports.exists = async (regNumber) => {
    const res = await Seller.find({
        registeredNumber: regNumber
    }, 'companyName');
    return res.length > 0;
};

exports.create = async (data) => {
    let seller = new Seller(data);
    await seller.save();
};

exports.update = async (id, data) => {
    await Seller
        .findByIdAndUpdate(id, {
            $set: {
                companyName: data.companyName
            }
        });
};

exports.delete = async (id) => {
    await Seller.findByIdAndDelete(id);
};