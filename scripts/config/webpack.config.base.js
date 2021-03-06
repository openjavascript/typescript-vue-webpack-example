const helpers = require('./helpers')
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const config = require('./config');

const path = require( 'path' );
const os = require('os')
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length});
const webpack = require('webpack');

const cssLoader = bool => {
    const defaultVal = [
        {
            loader: 'css-loader',
            options: {
                minimize: true,
                sourceMap: false
            }
        },
        {
            loader: 'less-loader',
            options: {
                sourceMap: true
            }
        }
    ];
    const postcssLoader = {
        loader: 'postcss-loader'
    };
    if (bool) {
        defaultVal.splice(1, 0, postcssLoader);
    }
    return defaultVal;
};

function createHappyPlugin(id, loaders) {
    return new HappyPack({
        id: id,
        loaders: loaders,
        threadPool: happyThreadPool,
        verbose: false,
    });
}

let webpackConfig = {
    entry: config.common.entries,
    output: {
        path: helpers.root('/public/static/'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        publicPath: './static/'
    },
    //devtool: 'source-map',
    resolve: {
        extensions: [ '.js', '.ts', '.tsx', '.vue', '.less', '.css', '.html', '.bak' ],
        alias: {
            '@static': helpers.root('/static'),
            'Utils': helpers.root( '/static/utils' ),
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [ helpers.root('node_modules'),helpers.root('vendor'), './vendor', 'vendor' ],
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                use: 'happypack/loader?id=js',
                include: [config.common.resource, config.common.lang]
            },
            {
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: ['./static/index.html']
            },
            {
                test: /\.bak$/,
                loader: 'raw-loader',
                exclude: ['./static/index.html']
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'happypack/loader?id=less'
                }) 
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'happypack/loader?id=css'
                }) 
            },
            {
                test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                        publicPath:
                            process.env.NODE_ENV == 'development'
                            ? config.dev.assetsPublicPath
                            : config.build.assetsPublicPath

                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: `images/[name].[ext]?branch=${config.branch}&ver=${
                            config.f2e_version
                        }`,
                        publicPath:
                            process.env.NODE_ENV == 'development'
                            ? config.dev.assetsPublicPath
                            : config.build.assetsPublicPath
                    }
                }
            }
        ]
    },
    externals: {
        echarts: 'echarts',
        THREE: 'THREE'
    },
    plugins: [
        new NamedModulesPlugin(),
        new CopyWebpackPlugin([{
            from: 'static/assets',
            to: './assets'
        } ]),
        new ExtractTextPlugin({
            disable: process.env.NODE_ENV == 'development',
            filename:
                "css/[name].css?branch={{$branches['branch']}}&ver={{$branches['f2e_version']}}",
            allChunks: true
        }),
        createHappyPlugin('less', cssLoader()),
        createHappyPlugin('css', ['css-loader']),
        new ProgressBarPlugin()
    ]
}

module.exports = webpackConfig
