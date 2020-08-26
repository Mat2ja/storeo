const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// Now all our wrap-handleres will have this middleware function applied
app.use(bodyParser.urlencoded({ extended: true })),

app.get('/', (req, res) => {
    res.send(`
        <div>
            <form method='POST'>
                <input name='email' type="email" placeholder="Email">
                <input name='password' type="password" placeholder="Password">
                <input name='passwordConfirmation' type="password" placeholder="Password Confirmation">
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Account created!!');
});

app.listen(69, () => {
    console.log('Listening')
});

