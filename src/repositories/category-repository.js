const mongoose = require('mongoose');
const Category = mongoose.model('Category');

exports.get = async () => {
    return await Category.find();
};

exports.getById = async (id) => {
    return await Category.findById(id);
};

exports.exists = async (description) => {
    const res = await Category.find({
        description: description
    }, 'description');
    return res.length > 0;
};

exports.create = async (data) => {
    var category = new Category(data);
    await category.save();
};

exports.update = async (id, data) => {
    await Category
        .findByIdAndUpdate(id, {
            $set: {
                description: data.description
            }
        });
};

exports.delete = async (id) => {
    await Category.findOneAndRemove(id);
};
