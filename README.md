# Secretform

Create secrets file from external secerts services such as AWS secret manager.

## Installation

```sh
npm i -g secretform
```

## Configuration

```json
{
  "args": {
    "outputPath": "./tests/secrets.json",
    "output": "json",
    "configPath": "./tests/secretform.json"
  },
  "secrets": [
    {
      "provider": {
        "type": "aws_secretmanager",
        "keys": ["test-secrets", "test-secrets2"],
        "profile": "default"
      },
      "map_file": "tests/map.json",
      "map": {
        "my_local_secret": "my_secret"
      },
      "options": {
        "show_map_only": false
      }
    },
    {
      "provider": {
        "type": "aws_secretmanager",
        "keys": ["test-secrets"],
        "profile": "default"
      }
    }
  ]
}
```

```yaml
args:
  outputPath: "./tests/secrets.yaml"
  output: "yaml"
  configPath: "./tests/secretform.yaml"
secrets:
  - provider:
      type: aws_secretmanager
      keys:
        - "{{stage}}-secrets"
        - "{{stage}}-secrets2"
      profile: default
    map:
      my_local_secret: my_secret
    options:
      show_map_only: false
```

## Usage

```sh
secretform --output json --outputPath "./tests/secrets.json" --configPath "./tests/secretform.json"
```
