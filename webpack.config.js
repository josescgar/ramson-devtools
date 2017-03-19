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
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.less$/, exclude: /node_modules/, loader: 'style-loader!css-loader!less-loader'},
            { test: /\.css$/, exclude: /node_modules/, loader: 'style-loader!css-loader'},
            { test: /\.(png|jpg)$/, exclude: /node_modules/, loader: 'file-loader?name=[name].[ext]&publicPath=img/&outputPath=/img/'}
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