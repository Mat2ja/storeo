const { validationResult } = require('express-validator');

module.exports = {
    handleErrors(templateFunc, dataCb) {
        // returns a function bcs we wanted to customize the middleware (with templateFunc argument)
        return async (req, res, next) => {
            const errors = validationResult(req)
            console.log(errors)
            if (!errors.isEmpty()) {
                let data = {};
                // data callback
                if (dataCb) {
                    data = await dataCb(req);
                }

                return res.send(templateFunc({ errors, ...data }));
            }

            next();
        }
    },
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect('/signin');
        }
        next();
    }
}