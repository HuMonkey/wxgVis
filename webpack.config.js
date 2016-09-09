var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        filename: '[name].js',
        path: './dist'
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin('common.js')
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.(js)$/,
            loaders: ['babel'],
        },{
            test: /\.(less|css)$/,
            loader: "style!css!less"
        },{
            test: /\.(png|jpg|gif)$/,
            loader: 'url?limit=25000',
            include: [path.join(__dirname, 'static/images'), path.join(__dirname, 'src/less')]
        }]
    },
    watch: true
};