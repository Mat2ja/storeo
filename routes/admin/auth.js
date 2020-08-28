
const express = require('express');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

// sub-router
const router = express.Router();


// Browser sends the request to access the server, servers sents a response
router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

// Browser submits data to the server
router.post('/signup', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    // Check if email already exists
    const existingUSer = await usersRepo.getOneBy({ email });

    if (existingUSer) {
        return res.send('Email in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords must match')
    }

    //* Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });

    //* Store the ID of the user inside users cookie
    // req.session is a object added by cookieSession middleware!
    // we can add properties to it and it will turn cookie into a encoded string
    req.session.userId = user.id;
    console.log(req.session);
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
    res.send(signinTemplate())
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });

    if (!user) {
        return res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePasswords(user.password, password);
    if (!validPassword) {
        return res.send('Invalid password');
    }

    // add to cookie
    req.session.userId = user.id;
    res.send('You are signed in!')
});

module.exports = router;