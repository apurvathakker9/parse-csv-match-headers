const path = require('path');
const common = require('./webpack.common');
const {merget, merge} = require('webpack-merge');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common,{
  devtool: 'eval-cheap-module-source-map',
  mode:'development',
  output: {
    path: path.join(__dirname, 'public'),
    filename: `bundle.js`,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port:3000,
    hot:true
  },
  plugins:[
    new webpack.DefinePlugin({
      // 'process.env': {
      //   'NODE_ENV': JSON.stringify("localhost"),
      // }
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new HtmlWebpackPlugin({
      title:'Import CSV',
      template: './public/index.html',
      minify: false
    }),
    new Dotenv({
      path: './.env.localhost',
      safe: true,
      allowEmptyValues: true
    }) //in order for environment variable to work
  ],
})