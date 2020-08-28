const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename')
        }
        this.filename = filename;

        // async code is not allowed in constructor
        // we dont mind waiting as it will happen only once
        try {
            // Checks if file exists, throws error if not
            fs.accessSync(this.filename);
        } catch (error) {
            // Create a file if it doesn't exist, and write in it
            fs.writeFileSync(this.filename, '[]');
        }
    }

    // Get all records
    async getAll() {
        // Open this.filename and parse the contents
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));
    }

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

    // Rewrite records
    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    // Get random id
    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    // Get one record
    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    // Delete one record
    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    // Update one record with the new attrs
    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Erorr(`Record with ${id} not found`);
        }

        // overwrite existing attributes and add new ones to given object
        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                // if even one filtered doesn't match, it is not found
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }
}

// export the entire class
// module.exports = UsersRepository;

// export an instance of the class (so no possible bugs with filename typos)
module.exports = new UsersRepository('users.json');

