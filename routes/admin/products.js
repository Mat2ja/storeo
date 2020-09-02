// External libraries
const express = require('express');
const multer = require('multer')

// Our files
const { handleErrors } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const { requireTitle, requirePrice } = require('./validators');


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })
// could've also defined middleware here I guess
// router.use(upload.single('image'));

// list out all products to admin
router.get('/admin/products', async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }));
})

// show a form to create a new product
router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}))
})

// middleware functions go between path and our handler
router.post(
    '/admin/products/new',
    upload.single('image'), // must be placed before because it parses everthing, but we need to validate them ourselves
    [requireTitle, requirePrice],
    handleErrors(productsNewTemplate),
    async (req, res) => {
        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;
        await productsRepo.create({ title, price, image })

        res.redirect('/admin/products')
    }
)

module.exports = router;