// webpack.config.dev.js
var webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    mode: "development",
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false',
        'react-hot-loader/patch',
        './web/main.js',
    ],
    devServer: {
        outputPath: __dirname
    },
    output: {
        path: '/',
        publicPath: 'http://localhost:8080/build/',
        filename: '[name].js'
    },
    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery",
    },
    plugins: require('./plugins').concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
        	$: "jquery",
        	jQuery: "jquery",
            jquery: "jquery"
        })
    ]),
    module: {
        rules: require('./loaders')
            .concat([
                {
                    test: /\.js?/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.scss$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
                }
            ])
    },
};
