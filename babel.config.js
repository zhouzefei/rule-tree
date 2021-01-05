const presets = [
    '@babel/env',
    '@babel/preset-react'
];

const plugins = [
    [
        '@babel/plugin-proposal-decorators',
        {
            legacy: true
        }
    ],
    [
        '@babel/plugin-proposal-class-properties',
        {
            loose: true
        }
    ],
    [
        '@babel/plugin-proposal-optional-chaining',
        {
            loose: true
        }
    ],
    // ['babel-plugin-styless']
];

if (!process.env.WEBPACK_DEV_SERVER) {
    plugins.push([
        'import',
        {
            libraryName: 'antd',
            // libraryDirectory: 'es',
            style: true,

        }
    ]);
}

module.exports = {presets, plugins};
