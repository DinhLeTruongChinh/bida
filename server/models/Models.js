// CLI: npm install mongoose --save
const mongoose = require('mongoose');

// schemas
const AdminSchema = mongoose.Schema({
  username: String,
  password: String
}, { versionKey: false });

const CategorySchema = mongoose.Schema({
  name: String
}, { versionKey: false });

const CustomerSchema = mongoose.Schema({
  username: String,
  password: String,
  name: String,
  phone: String,
  email: String,
  active: Number,
  token: String
}, { versionKey: false });

const ProductSchema = mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  cdate: Number,
  category: CategorySchema
}, { versionKey: false });

const ItemSchema = mongoose.Schema({
  product: ProductSchema,
  quantity: Number
}, { versionKey: false, _id: false });

const OrderSchema = mongoose.Schema({
  cdate: Number,
  total: Number,
  status: String,
  customer: CustomerSchema,
  items: [ItemSchema]
}, { versionKey: false });

// models
const Admin = mongoose.model('Admin', AdminSchema);
const Category = mongoose.model('Category', CategorySchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = { Admin, Category, Customer, Product, Order };