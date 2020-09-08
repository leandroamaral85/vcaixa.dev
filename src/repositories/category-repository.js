const mongoose = require('mongoose');
const Category = mongoose.model('Category');

exports.get = async () => {
    return await Category.find();
};

exports.getById = async (id) => {
    return await Category.findById(id);
};

exports.exists = async (name) => {
    const res = await Category.find({
        name: name
    });
    return res.length > 0;
};

exports.create = async (data) => {
    var category = new Category(data);
    return await category.save();
};

exports.update = async (id, data) => {
    await Category
        .findByIdAndUpdate(id, {
            $set: {
                name: data.name
            }
        });
    return this.getById(id);    
};

exports.delete = async (id) => {
    await Category.findByIdAndDelete(id);
};
