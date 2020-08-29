module.exports = {
    getError(errors, prop) {
        // little bit of a cheat using try-catch
        try {
            return errors.mapped()[prop].msg;
            // mapped turns errors into object with param as a key, and error object as a value
        } catch (error) {
            return '';
        }
    }
};