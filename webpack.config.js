const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        devtools: './src/wiring/devtools.js',
        background: './src/wiring/background.js',
        content: './src/wiring/content.js',
        wrapper: './src/wiring/wrapper.js',
        app: './src/app/app.js'
    },
    output: {
        filename: 'dist/[name].js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader?presets[]=es2015'
            }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
            {from: 'manifest.json', to: 'dist'},
            {from: 'src/wiring/*.html', to: 'dist', flatten: true},
            {from: 'src/app/app.html', to: 'dist', flatten: true}
        ])
    ]
};