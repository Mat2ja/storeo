const express = require('express');
const bodyParser = require('body-parser'); // middleware
const cookieSession = require('cookie-session'); // middleware
const authRouter = require('./routes/admin/auth')

const app = express();

// Now all our wrap-handleres will have this middleware function applied
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['aoz8j4fnmb73t'] // encryptio key for stored cookies
}));
app.use(authRouter);

app.listen(3000, () => {
    console.log('Listening');
});

