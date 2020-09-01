const express = require('express');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');

const { requireTitle, requirePrice } = require('./validators');
const { validationResult } = require('express-validator');


const router = express.Router();

// list out all products to admin
router.get('/admin/products', (req, res) => {

})

// show a form to create a new product
router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}))
})

router.post(
    '/admin/products/new',
    [requireTitle, requirePrice],
    (req, res) => {
        const errors = validationResult(req);
        console.log(req.body);

        req.on('data', data => {
            console.log(data.toString());
        });
        
        res.send('submitted')
    }
)
module.exports = router;