const webpack = require('webpack');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProduction ? 'production' : 'development',
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction ? 'lazily.min.js' : 'index.js',
        library: 'lazily',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ],
    resolve: {
        extensions: ['.js']
    }
};
