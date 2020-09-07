const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.get = async () => {
    return await User.find();
};

exports.getById = async (id) => {
    return await User.findById(id);
};

exports.exists = async (eml) => {
    const res = await User.find({
        email: eml
    }, 'name');
    return res.length > 0;
};

exports.create = async (data) => {
    var user = new User(data);
    await user.save();
};

exports.update = async (id, data) => {
    await User
        .findByIdAndUpdate(id, {
            $set: {
                companyName: data.companyName
            }
        });
};

exports.delete = async (id) => {
    await User.findOneAndRemove(id);
};

exports.authenticate = async (data) => {
    const res = await User.findOne({
        email: data.email,
        password: data.password
    });
    return res;
}