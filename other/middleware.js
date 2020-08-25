// Middleware callback
const bodyParser = (req, res, next) => {
    if (req.method === 'POST') {
        req.on('data', data => {
            const parsed = data.toString('utf8').split('&');
            const formData = {};
            for (let pair of parsed) {
                const [key, value] = pair.split('=');
                formData[key] = value;
            }
            req.body = formData;
            next();
        });
    } else {
        // Onto a next callback function
        next();
    }
}

app.post('/', bodyParser, (req, res) => {
    console.log(req.body);
    res.send('Account created!!');
});

// const bodyParser = require('body-parser');
// app.post('/', bodyParser.urlencoded({ extended: true }), (req, res) => {
//     console.log(req.body);
//     res.send('Account created!!');
// });