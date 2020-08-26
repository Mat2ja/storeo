const fs = require('fs');
const crypto = require('crypto');

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

    async getAll() {
        // Open this.filename and parse the contents
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));
    }

    async create(attrs) {
        attrs.id = this.randomId();

        const records = await this.getAll();
        records.push(attrs);

        await this.writeAll(records);
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }
}

// we wrap it bcs backthen in node you cant have await at the top level of code
const test = async () => {
    const repo = new UsersRepository('users.json');

    const user = await repo.delete('3294870b');

}

test();