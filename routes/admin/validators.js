const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireTitle:
        check('title')
            .trim()
            .isLength({ min: 5, max: 40 })
            .withMessage('Must be between 4 and 40 characters'),
    requirePrice:
        check('price')
            .trim()
            .toFloat()
            .isFloat({ min: 1 })
            .withMessage('Must be a number greater than 1'),
    requireEmail:
        check('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage('Must be a valid email')
            .custom(async (email) => {
                const existingUSer = await usersRepo.getOneBy({ email });
                if (existingUSer) {
                    throw new Error('Email already in use');
                }
            }),
    requirePassword:
        check('password')
            .trim()
            .isLength({ min: 4, max: 24 })
            .withMessage('Must be between 4 and 24 characters'),
    requirePasswordConfirmation:
        check('passwordConfirmation')
            .trim()
            .isLength({ min: 4, max: 24 })
            .withMessage('Must be between 4 and 24 characters')
            .custom((passwordConfirmation, { req }) => {
                if (passwordConfirmation !== req.body.password) {
                    throw new Error('Passwords must match');
                }
            }),
    requireEmailExists:
        check('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage('Must provide a valid email')
            .custom(async email => {
                const user = await usersRepo.getOneBy({ email });
                if (!user) {
                    console.log('inside custom');
                    throw new Error('Email not found');
                }
            }),
    requireValidPasswordForUser:
        check('password')
            .trim()
            .custom(async (password, { req }) => {
                const user = await usersRepo.getOneBy({ email: req.body.email });
                if (!user) {
                    throw new Error('Invalid password');
                }

                const validPassword = await usersRepo.comparePasswords(user.password, password);
                if (!validPassword) {
                    throw new Error('Invalid password');
                }
            })
}