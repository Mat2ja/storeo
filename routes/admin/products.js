// External libraries
const express = require('express');
const multer = require('multer')

// Our files
const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice } = require('./validators');


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

// list out all products to admin
router.get(
    '/admin/products',
    requireAuth,
    async (req, res) => {
        const products = await productsRepo.getAll();
        res.send(productsIndexTemplate({ products }));
    })

// show a form to create a new product
router.get(
    '/admin/products/new',
    requireAuth,
    (req, res) => {
        res.send(productsNewTemplate({}))
    })

// middleware functions go between path and our handler
router.post(
    '/admin/products/new',
    requireAuth,
    upload.single('image'), // must be placed before because it parses everthing, but we need to validate them ourselves
    [requireTitle, requirePrice],
    handleErrors(productsNewTemplate),
    async (req, res) => {
        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;
        await productsRepo.create({ title, price, image })

        res.redirect('/admin/products')
    }
);

router.get(
    // :id is a wildcard
    '/admin/products/:id/edit',
    requireAuth,
    async (req, res) => {
        // get id from URL
        const product = await productsRepo.getOne(req.params.id);

        if (!product) {
            return res.send('Product not found')
        }

        res.send(productsEditTemplate({ product }))
    }
)

router.post(
    '/admin/products/:id/edit',
    requireAuth,
    upload.single('image'),
    [requireTitle, requirePrice],
    handleErrors(productsEditTemplate, async (req) => {
        const product = await productsRepo.getOne(req.params.id);
        return { product };
    }),
    async (req, res) => {
        const changes = req.body;

        if (req.file) {
            changes.image = req.file.buffer.toString('base64');
        }

        try {
            await productsRepo.update(req.params.id, changes)
        } catch (error) {
            return res.send('Could not find item')
        }

        res.redirect('/admin/products')
    }
)

router.post(
    '/admin/products/:id/delete',
    requireAuth,
    async (req, res) => {
        await productsRepo.delete(req.params.id);

        res.redirect('/admin/products')
    }
)

module.exports = router;