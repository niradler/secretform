#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const providers = require('./providers')
const { Output, Config } = require('./utils')

const argv = yargs(hideBin(process.argv))
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging',
        default: false
    })
    .option('output', {
        alias: 'o',
        type: 'string',
        description: 'output type, json, yaml, dotenv',
        default: 'json'
    })
    .option('outputPath', {
        alias: 'op',
        type: 'string',
        description: 'output path',
        default: path.join(process.cwd(), "secrets.json")
    })
    .option('disableOutput', {
        alias: 'do',
        type: 'boolean',
        description: 'disable output',
        default: false
    })
    .option('configPath', {
        alias: 'cp',
        type: 'string',
        description: 'output type, json, yaml, .env',
        default: "secretform.json"
    })
    .argv

const main = async (argv) => {
    try {
        const configPath = path.join(process.cwd(), argv.configPath)
        const c = new Config(configPath)
        c.exists()
        const config = c.load()
        const args = Object.assign(argv, config.args || {})
        if (argv.verbose) {
            console.log(args)
            console.log(config)
        }
        const secretValues = [];
        const secrets = config.secrets
        for (let i = 0; i < secrets.length; i++) {
            const secret = secrets[i];
            const provider = providers.newProvider(secret.provider)
            let aggValue = await provider.getSecrets(secret.provider.keys)
            if (secret.map || secret.map_file) {
                let map = secret.map || {};
                if (secret.map_file) {
                    map = Object.assign(map, JSON.parse(fs.readFileSync(path.join(process.cwd(), secret.map_file), 'utf8')))
                }
                let evaluated = {}
                Object.keys(map).forEach((key) => {
                    evaluated[key] = aggValue[map[key]]
                })
                if (secret.options?.show_map_only) {
                    aggValue = evaluated
                } else {
                    aggValue = Object.assign(aggValue, evaluated)
                }
            }
            secretValues.push(aggValue)
        }
        const output = new Output(args.output, args.outputPath, Object.assign(...secretValues))
        if (!args.disableOutput) {
            output.write();
        }
        console.log(output.toString())
    } catch (error) {
        console.log(error)
    }
}
main(argv);