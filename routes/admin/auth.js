const express = require('express');
const { validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
    requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    requireEmailExists,
    requireValidPasswordForUser
} = require('./validators');

// sub-router
const router = express.Router();

// Browser sends the request to access the server, servers sents a response
router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

// Browser submits data to the server
router.post(
    '/signup',
    // returns the validationResult object with the error if it fails validation
    [requireEmail, requirePassword, requirePasswordConfirmation], 
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // return to signup page
            return res.send(signupTemplate({ req, errors }));
        }

        const { email, password } = req.body;

        const user = await usersRepo.create({ email, password });

        //* Store the ID of the user inside users cookie
        // req.session is a object added by cookieSession middleware!
        // we can add properties to it and it will turn cookie into a encoded string
        req.session.userId = user.id;
        res.send('Account created!!');
    });

// SIGNOUT
router.get('/signout', (req, res) => {
    // forget the current session (cookie)
    req.session = null;
    res.send('You are logged out');
})

// SIGNIN
router.get('/signin', (req, res) => {
    res.send(signinTemplate({}))
});

router.post(
    '/signin',
    [requireEmailExists, requireValidPasswordForUser],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.send(signinTemplate({ errors }))
        }
        const { email } = req.body;

        const user = await usersRepo.getOneBy({ email });

        // add to cookie
        req.session.userId = user.id;
        res.send('You are signed in!')
    });

module.exports = router;