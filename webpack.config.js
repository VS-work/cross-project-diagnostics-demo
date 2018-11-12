const path = require('path');

module.exports = () => ({
    mode: 'production',
    entry: {
        'frontend': './src/frontend.ts'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'frontend.js',
        libraryTarget: 'var',
        library: 'frontend'
    },
    performance: {hints: false},
    target: 'web',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: []
});
