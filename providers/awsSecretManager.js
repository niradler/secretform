const { SecretsManagerClient, CreateSecretCommand, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { fromIni } = require("@aws-sdk/credential-providers");
const BaseProvider = require('./base')

class AwsSecretManagerProvider extends BaseProvider {
    constructor(config) {
        super(config)
        this.config = config
        const params = {}
        params.region = config.region || "us-east-1"
        if (config.profile)
            params.credentials = fromIni({ profile: config.profile })
        this.client = new SecretsManagerClient(params);
    }

    async createSecret(name, value) {
        try {
            value = JSON.stringify(value)
        } catch (error) {

        }
        const command = new CreateSecretCommand({
            Name: name,
            SecretString: value
        });
        const data = await client.send(command);

        return data
    }

    async getSecret(key) {
        console.log(key)
        const command = new GetSecretValueCommand({
            SecretId: key,
        });
        try {
            const data = await this.client.send(command);

            return JSON.parse(data.SecretString)
        } catch (error) {
            console.error(`AwsSecretManagerProvider:${key}`, error)
        }
        return {}
    }

    async getSecrets(keys) {
        const secretsFetchedPromises = keys.map(key => this.getSecret(key))
        const secretsFetched = await Promise.all(secretsFetchedPromises)

        return Object.assign(...secretsFetched)
    }
}

module.exports = AwsSecretManagerProvider