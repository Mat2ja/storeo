const express = require('express');
const cartsRepo = require('../repositories/carts');

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

// Receive a post request to delete an item from cart

module.exports = router;