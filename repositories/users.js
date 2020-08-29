const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    // Create a new record with given attributes
    async create(attrs) {
        attrs.id = this.randomId();

        // hash the password+salt
        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64); // we promisified it

        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        }
        records.push(record);

        await this.writeAll(records);

        return attrs;
    }

    async comparePasswords(saved, supllied) {
        // Saved -> password saved in our database: 'hashed.salt'
        // Supllied -> password given to us by a user trying to sign in
        const [hashed, salt] = saved.split('.');
        const hashedSuplliedBuf = await scrypt(supllied, salt, 64); // hashed supplied buffer

        return hashed === hashedSuplliedBuf.toString('hex');
    }
}

// export the entire class
// module.exports = UsersRepository;

// export an instance of the class (so no possible bugs with filename typos)
module.exports = new UsersRepository('users.json');

