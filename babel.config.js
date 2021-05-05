module.exports = function getGlobalBabelConfig(api) {
    api.cache(true);
    return {
        env: {
            es: {
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            corejs: 3,
                            useBuiltIns: 'entry',
                            targets: {
                                esmodules: true
                            },
                            modules: false
                        }
                    ]
                ]
            },
            cjs: {
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            corejs: 3,
                            useBuiltIns: 'entry'
                        }
                    ]
                ]
            }
        },
        plugins: [
            // '@babel/transform-runtime',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-syntax-dynamic-import'
        ]
    };
};
