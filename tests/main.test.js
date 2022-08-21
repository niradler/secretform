const cli = require('../cli')
test('cli test', async () => {
    const secrets = await cli({
        output: 'json',
        outputPath: './tests/secrets.json',
        configPath: './tests/secretform.json',
        verbose: false,
        disableOutput: true
    })

    expect(secrets).toEqual({
        "my_secret": "secret value",
        "my_secret2": "test2",
        "my_local_secret": "secret value",
        "local_map_file": "test2"
    });
});