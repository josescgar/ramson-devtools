const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        devtools: './src/wiring/devtools.js',
        background: './src/wiring/background.js',
        content: './src/wiring/content.js',
        wrapper: './src/wiring/wrapper.js',
        app: './src/app/app.jsx'
    },
    output: {
        path: 'dist',
        filename: '[name].js'
    },

    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel-loader' }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/app/app.html',
            filename: 'app.html',
            chunks: ['app']
        }),
        new CopyWebpackPlugin([
            {from: 'manifest.json'},
            {from: 'src/wiring/*.html', flatten: true}
        ])
    ]
};