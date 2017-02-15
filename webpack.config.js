const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        devtools: './src/js/devtools.js',
        background: './src/js/background.js',
        content: './src/js/content.js',
        main: './src/js/components/main.js'
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
            {from: 'src/js/**/*.html', to: 'dist'}
        ])
    ]
};