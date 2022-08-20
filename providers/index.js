const AwsSecretManagerProvider = require('./awsSecretManager')
const newProvider = (provider) => {
    switch (provider.type) {
        case "aws_secretmanager":
            return new AwsSecretManagerProvider(provider)
        default:
            throw new Error("Unknown provider type")
    }

}
module.exports = { newProvider }