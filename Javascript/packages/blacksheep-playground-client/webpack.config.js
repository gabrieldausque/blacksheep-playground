const path = require('path');
const webpack = require('webpack');
const uglifyer = require('terser-webpack-plugin');

module.exports =
    {
        entry: {
            'blacksheep-playground-client': './src/index.ts',
            'blacksheep-playground-client.min': './src/index.ts'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
            libraryTarget: 'umd',
            library: 'BlackSheepPlayGroundClient',
            umdNamedDefine: true
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        devtool: 'source-map',
        optimization: {
            minimize: true,
            minimizer: [new uglifyer()]
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }]
        }
    }

