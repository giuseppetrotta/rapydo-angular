const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin')
// const AotPlugin = require('@ngtools/webpack').AngularCompilerPlugin;

const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  // devtool: 'source-map',

  mode: 'production',

  output: {
    // path: helpers.root('dist'),
    path: '/modules/dist',
    publicPath: process.env.FRONTEND_PREFIX,
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  module: {
    /*
    rules: [
      {
        test: /\.ts$/,
        loaders: ['@ngtools/webpack']
      }
    ]
    */
  },

  plugins: [
    /*
    new AotPlugin({
        tsConfigPath: helpers.root('src', 'tsconfig.json'),
        entryModule: '/rapydo/src/app/app.module#AppModule'
    }),
    */
    /*
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),
    */
    new CompressionPlugin(),
    new ExtractTextPlugin('[name].[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    })
  ]
});

