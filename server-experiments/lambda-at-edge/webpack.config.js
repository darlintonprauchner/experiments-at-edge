const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'production',
    devtool: 'cheap-source-map',
    entry: slsw.lib.entries,
    target: 'node',
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    externals: ['aws-sdk', nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [
                    [
                        path.resolve(__dirname, '.serverless'),
                        path.resolve(__dirname, 'node_modules'),
                        path.resolve(__dirname, '.webpack'),
                    ],
                ],
                options: {
                    experimentalFileCaching: true,
                    transpileOnly: true,
                },
            },
        ],
    }
};