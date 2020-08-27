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
app.get('/signup', (req, res) => {
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
app.post('/signup', async (req, res) => {
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
app.get('/signout', (req, res) => {
    // forget the current session (cookie)
    req.session = null;
    res.send('You are logged out');
})

// SIGNIN
app.get('/signin', (req, res) => {
    res.send(`
        <div>
            <form method='POST'>
                <input name='email' type="email" placeholder="Email">
                <input name='password' type="password" placeholder="Password">
                <button>Sign In</button>
            </form>
        </div>
    `)
});
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });

    if (!user) {
        return res.send('Email not found');
    }
    if (user.password !== password) {
        return res.send('Invalid password');
    }

    // add to cookie
    req.session.userId = user.id;
    res.send('You are signed in!')
});

app.listen(3000, () => {
    console.log('Listening');
});

