const express = require('express');
const bodyParser = require('body-parser'); // middleware
const cookieSession = require('cookie-session'); // middleware
const authRouter = require('./routes/admin/auth')
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();

// for every request, express will first look into public folder
app.use(express.static('public'));

// Now all our wrap-handleres will have this middleware function applied
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['aoz8j4fnmb73t'] // encryption key for stored cookies
}));
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
    console.log('>> Listening');
});

