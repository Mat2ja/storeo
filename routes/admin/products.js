// External libraries
const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer')

// Our files
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })
// could've also defined middleware here I guess
// router.use(upload.single('image'));

// list out all products to admin
router.get('/admin/products', (req, res) => {

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
    async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);

        if (!errors.isEmpty()) {
            return res.send(productsNewTemplate({ errors }));
        }

        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;
        await productsRepo.create({ title, price, image })

        res.send('submitted')
    }
)

module.exports = router;