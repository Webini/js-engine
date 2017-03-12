const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'game.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: require('./babelrc.json')
      }
    ]
  },
  devtool: 'source-map', // enum
  target: 'web',
  plugins: [ new HtmlWebpackPlugin() ],
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    compress: true,
    host: 'localhost',
    port: 3000,
    //watchContentBase: true
  }
};