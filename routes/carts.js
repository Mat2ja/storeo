const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');
const router = express.Router();

// Receive a post request to add an item to cart
router.post(
    '/cart/products',
    async (req, res) => {
        let cart;

        // check if cartId found in cookie
        if (!req.session.cartId) {
            // create a cart
            cart = await cartsRepo.create({ items: [] })
            // Add cartId to cookie
            req.session.cartId = cart.id;
        } else {
            // Find the existing cart
            cart = await cartsRepo.getOne(req.session.cartId)
        }

        const existingItem = cart.items.find(item => item.id === req.body.productId);
        if (existingItem) {
            // increment quanitity and save cart
            existingItem.quantity++;
        } else {
            // add new product to item array
            cart.items.push({ id: req.body.productId, quantity: 1 })
        }

        await cartsRepo.update(cart.id, {
            items: cart.items
        })


        res.send('Added to cart')
    })

// Receive a get request to show all items in cart
router.get(
    '/cart',
    async (req, res) => {
        if (!req.session.cartId) {
            // if cart for the user doesnt exits, return to products
            //todo build empty cart page
            return res.redirect('/')
        }

        const cart = await cartsRepo.getOne(req.session.cartId);

        for (let item of cart.items) {
            // get product from the product id in the cart
            const product = await productsRepo.getOne(item.id);

            // temporarily add whole product to cart
            item.product = product;
        }

        res.send(cartShowTemplate({ items: cart.items }))
    }
)

// Receive a post request to delete an item from cart

module.exports = router;