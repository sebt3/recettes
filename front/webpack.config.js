import path from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import TerserPlugin from "terser-webpack-plugin"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"

import nodeExternals from 'webpack-node-externals'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// eslint-disable-next-line no-undef
const isDevel = process.env.NODE_ENV !== 'production'
export default {
  entry: './src/main.ts',
  mode: isDevel?'development':'production',
  devtool: isDevel?'source-map':'nosources-source-map',
  externals: [nodeExternals({allowlist: ['graphql-request','cross-fetch','graphql','extract-files','form-data']})],
  optimization: {
    usedExports: true,
    minimize: !isDevel,
    minimizer: !isDevel?[
      new TerserPlugin({terserOptions: {mangle: false,module: true,format: {beautify: false, comments: false}},extractComments: false}),
      new CssMinimizerPlugin()
    ]:[]
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, isDevel?'../public':'../dist/public')
  },
  module: {rules: [{
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {loader: 'ts-loader',options: {transpileOnly: true}}
  },{
    test: /\.(scss|css)$/,
    exclude: /node_modules/,
    use: [MiniCssExtractPlugin.loader,'css-loader',{loader: 'sass-loader',options: {sourceMap: true}}]
  }]},
  resolve: {extensions: ['.tsx', '.ts', '.js']},
  plugins: [
    new MiniCssExtractPlugin({filename: '[name].[contenthash].css',chunkFilename: '[id].css'}),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({title: "Recettes",template: './src/index.html'}),
    new ForkTsCheckerWebpackPlugin(),
    new CopyPlugin({patterns: [{ from: 'assets', to: 'assets' }]})
  ]
};