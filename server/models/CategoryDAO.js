require('../utils/MongooseUtil');
const Models = require('./Models');

const CategoryDAO = {
  async selectAll() {
    const categories = await Models.Category.find({}).exec();
    return categories;
  },

  async insert(category) {
    const mongoose = require('mongoose');
    category._id = new mongoose.Types.ObjectId();
    const result = await Models.Category.create(category);
    return result;
  },

  async update(id, category) {
    const newValues = { name: category.name };
    const result = await Models.Category.findByIdAndUpdate(
      id,
      newValues,
      { new: true }
    );
    return result;
  },

  async delete(id) {
    const result = await Models.Category.findByIdAndDelete(id);
    return result;
  },

  async selectByID(_id) {
    const category = await Models.Category.findById(_id).exec();
    return category;
  }
};

module.exports = CategoryDAO;
