const webpack = require('webpack');
const conf = require('./base.js');

const babelrc = require('./babelrc.json');
delete babelrc.presets[0][1].debug;

babelrc.plugins= [
  'transform-remove-debugger',
  'transform-remove-console'
];

conf.plugins.push(new webpack.optimize.UglifyJsPlugin());

conf.module.loaders[0].query = babelrc;
conf.devtool = 'nosources-source-map';

module.exports = conf;