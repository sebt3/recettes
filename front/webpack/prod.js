/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../../dist/public')
  },
  devtool: 'source-map'
});