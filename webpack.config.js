const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-first-webpack.bundle.js'
    },
    module: {
        rules: [ {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
        ]
    },
    devServer: {
        publicPath: path.resolve(__dirname, '/dist/'),
        contentBase: path.resolve(__dirname, './src/'),
    }
};
