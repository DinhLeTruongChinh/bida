const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil');

// daos
const CategoryDAO = require('../models/CategoryDAO');
const AdminDAO = require('../models/AdminDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require ('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');

// ================= LOGIN =================
router.post('/login', async function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      success: false,
      message: 'Please input username and password'
    });
  }

  const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
  if (!admin) {
    return res.json({
      success: false,
      message: 'Incorrect username or password'
    });
  }

  const token = JwtUtil.genToken({ username: admin.username });
  res.json({
    success: true,
    message: 'Authentication successful',
    token: token
  });
});

// ================= CHECK TOKEN =================
router.get('/token', JwtUtil.checkToken, function (req, res) {
  res.json({
    success: true,
    message: 'Token is valid'
  });
});

// ================= CATEGORY CRUD =================

// GET ALL
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// ADD
router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const { name } = req.body;

  if (!name) {
    return res.json(false);
  }

  const result = await CategoryDAO.insert({ name });
  res.json(result);
});

// UPDATE
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.json(false);
  }

  const result = await CategoryDAO.update(id, { name });
  res.json(result);
});

// DELETE
router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const { id } = req.params;
  const result = await CategoryDAO.delete(id);
  res.json(result);
});

// ================= PRODUCT CRUD =================

// GET WITH PAGINATION
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  var products = await ProductDAO.selectAll();
  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  let curPage = 1;
  if (req.query.page) {
    curPage = parseInt(req.query.page);
  }
  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage); 
  const result = {
    products: products,
    noPages: noPages,
    curPage: curPage
  };

  res.json(result);
});
// ADD
router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds

  const category = await CategoryDAO.selectByID(cid);

  const product = {
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };

  const result = await ProductDAO.insert(product);
  res.json(result);
});
// UPDATE
router.put('/products', JwtUtil.checkToken, async function (req, res) {
  const _id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds

  const category = await CategoryDAO.selectByID(cid);
  const product = {
    _id: _id,
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };

  const result = await ProductDAO.update(product);
  res.json(result);
});
// DELETE
router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    if (!_id) return res.status(400).json({ success: false, message: 'ID is required' });

    const result = await ProductDAO.delete(_id);
    if (!result) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

//order
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});
router.put('/orders/status/:id', JwtUtil.checkToken, async function(req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
});

// customer
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
    const customers = await CustomerDAO.selectAll();
    res.json(customers);
});
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const token = req.body.token;
    const result = await CustomerDAO.active(_id, token, 0);
    res.json(result);
});
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const cust = await CustomerDAO.selectByID(_id);
    if (cust) {
        const send = await EmailUtil.send(cust.email, cust._id, cust.token);
        if (send) {
            res.json({ success: true, message: 'Please check email' });
        } else {
            res.json({ success: false, message: 'Email failure' });
        }
    } else {
        res.json({ success: false, message: 'Not exists customer' });
    }
});

module.exports = router;
