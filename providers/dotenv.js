
const fs = require('fs')
const dotenv = require('dotenv')
const BaseProvider = require('./base')

class DotenvProvider extends BaseProvider {
    constructor(config) {
        super(config)
    }

    getSecret(key) {

        try {
            const file = fs.readFileSync(key, 'utf-8')
            const buf = Buffer.from(file)
            const config = dotenv.parse(buf)

            return config
        } catch (error) {
            console.error(`DotenvProvider:${key}`, error)
        }
        return {}
    }

    async getSecrets(keys) {
        const secretsFetched = keys.map(key => this.getSecret(key))

        return Object.assign(...secretsFetched)
    }
}

module.exports = DotenvProvider