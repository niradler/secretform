const AwsSecretManagerProvider = require('./awsSecretManager')
const Dotenv = require('./dotenv')

const newProvider = (provider) => {
    switch (provider.type) {
        case "aws_secretmanager":
            return new AwsSecretManagerProvider(provider)
        case "dotenv":
            return new Dotenv(provider)
        default:
            throw new Error("Unknown provider type")
    }

}
module.exports = { newProvider }