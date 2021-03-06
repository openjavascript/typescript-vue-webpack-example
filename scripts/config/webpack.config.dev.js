
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const helpers = require('./helpers')
const webpackConfig = require('./webpack.config.base')
const env = require('../environment/dev.env')

let prod = require( '../../prod.config' );
let config = require( './config' );

prod.host = prod.host || 'localhost';

let url = [ 'http://', prod.host ];
prod.port && url.push( ':', prod.port );
url.push( '/' );

webpackConfig.module.rules = [
    ...webpackConfig.module.rules,
]

webpackConfig.output =  {
    filename: 'static/js/[name].js'
    , publicPath:  url.join('')
    //, publicPath:  '/'
},

webpackConfig.plugins = [...webpackConfig.plugins,

    new webpack.DefinePlugin({
        'process.env': env
    }),

    new HtmlWebpackPlugin({
        inject: true,
        filename: "index.html",
        chunks: ['manifest', 'vendor', 'index'],
        template: helpers.root('/static/index.html'),
        favicon: helpers.root('/static/favicon.ico')
    }),

    new HtmlWebpackPlugin({
        inject: true,
        filename: "login.html",
        chunks: ['manifest', 'vendor', 'login'],
        template: helpers.root('/static/index.html'),
        favicon: helpers.root('/static/favicon.ico')
    }),

    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module) {
            return module.context && module.context.indexOf('node_modules') !== -1
        }
    }),

    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
    }),

    new ExtractTextPlugin({
        disable: process.env.NODE_ENV == 'development',
        filename:
            "static/css/[name].css?branch={{$branches['branch']}}&ver={{$branches['f2e_version']}}",
        allChunks: true
    })
]

webpackConfig.devServer = {
    port: prod.port,
    host: prod.host,
    open: false,
    hot: true,
    historyApiFallback: true,
    contentBase: config.dev.assetsProdRoot,
    publicPath: '/',
    headers: {
        "Access-Control-Allow-Origin": "*"
    },
    watchOptions: {
        poll: config.dev.poll
        , ignored: [/node_modules/, /__test__/, /\.bak$/ ]
    },
    before: function(app) {
        //console.log( app );
        app.get('*.css', function(req, res) {
            res.sendStatus(200);
        });
    }
}

module.exports = webpackConfig
