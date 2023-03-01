const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PACKAGE = require('./package.json');
const version = PACKAGE.version

module.exports = merge(common, {
  devtool: "source-map",
  mode:'production',
  output: {
    path: path.join(__dirname, 'public'),
    filename: `bundle-${version}.js`,
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }),
    new Dotenv({
      path: './.env.staging', 
      safe: true, 
      allowEmptyValues: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('staging')
    }),
    new HtmlWebpackPlugin({  
      title:'Import CSV',
      template: './public/index.html',
      minify: false
    }) 
  ],

});
