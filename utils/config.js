const yaml = require('js-yaml');
const fs = require('fs');
const Handlebars = require("handlebars");

class Config {
    constructor(path) {
        this.path = path
        this.type = path.endsWith('.json') ? 'json' : path.endsWith('.yaml') ? 'yaml' : path.endsWith('.yml') ? 'yaml' : 'json'
    }
    exists() {
        if (!fs.existsSync(this.path)) {
            throw new Error(`Config file ${this.path} not found.`)
        }
    }
    load() {
        let template;
        switch (this.type) {
            case "json":
                template = Handlebars.compile(fs.readFileSync(this.path, 'utf8'));
                return JSON.parse(template(process.env))
            case "yaml":
                template = Handlebars.compile(fs.readFileSync(this.path, 'utf8'));
                return yaml.load(template(process.env))
            default:
                throw new Error(`Config file ${this.path} should be yaml or json.`)
        }
    }
}

module.exports = Config