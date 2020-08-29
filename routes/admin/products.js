const express = require('express');
const productsRepo = require('../../repositories/products');

const router = express.Router();

// list out all products to admin
router.get('/admin/products', (req, res) => {

})

// show a form to create a new product
router.get('/admin/products/new', (req, res) => {

})

module.exports = router;