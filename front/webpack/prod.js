/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const common = require('./common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map'
});