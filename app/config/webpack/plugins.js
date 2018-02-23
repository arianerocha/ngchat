const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

module.exports = function (application, env) {
  return [

    new CleanWebpackPlugin(['www'], {
      root: application,
      verbose: false,
      dry: false,
      exclude: []
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      minimize: false,
    }),

    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: env === 'prod' ? JSON.stringify('production') : JSON.stringify('development')
        }
      }
    }),

    new WebpackBuildNotifierPlugin({
      title: 'ngChat',
      suppressSuccess: false
    }),

    new FriendlyErrorsWebpackPlugin({
      clearConsole: true
    }),

    new webpack.NormalModuleReplacementPlugin(
      /\.\/angular/,
      './angular.min.js'
    ),

    new webpack.HashedModuleIdsPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: Infinity
    }),

    new webpack.optimize.CommonsChunkPlugin({
      names: ['manifest', 'vendors'].reverse(),
      minChunks: Infinity
    }),

    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200
    }),

    new HtmlWebpackPlugin({
      chunksSortMode: 'dependency',
      template: 'index.tpl.html',
      filename: 'index.html',
      inject: 'body',
      cache: true,
      hash: true,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    }),
  ];

};
