const express = require('express');
const bodyParser = require('body-parser'); // middleware
const cookieSession = require('cookie-session'); // middleware
const usersRepo = require('./repositories/users');

const app = express();
// Now all our wrap-handleres will have this middleware function applied
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['aoz8j4fnmb73t'] // encryptio key for stored cookies
}));

// Browser sends the request to access the server, servers sents a response
app.get('/', (req, res) => {
    res.send(`
        <div>
            Your id is: ${req.session.userId}
            <form method='POST'>
                <input name='email' type="email" placeholder="Email">
                <input name='password' type="password" placeholder="Password">
                <input name='passwordConfirmation' type="password" placeholder="Password Confirmation">
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

// Browser submits data to the server
app.post('/', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    // Check if email already exists
    const existingUSer = await usersRepo.getOneBy({ email })
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

app.listen(3000, () => {
    console.log('Listening');
});

