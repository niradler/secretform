const yaml = require('js-yaml');
const fs = require('fs');

class Output {
    constructor(type, path, value) {
        this.type = type
        this.value = value
        this.path = path
    }

    toString() {
        switch (this.type) {
            case "json":
                return JSON.stringify(this.value, null, 2)
            case "yaml":
            case "yml":
                return yaml.dump(this.value)
            case "env":
                return Object.keys(this.value).map(key => `${key}=${this.value[key]}`).join("\n")
            default:
                return this.value
        }
    }

    write() {
        fs.writeFileSync(this.path, this.toString())
    }
}

module.exports = Output