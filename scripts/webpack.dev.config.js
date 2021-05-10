const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');


const tsconfigRaw = fs.readFileSync(path.resolve(__dirname, '..', 'tsconfig.json')).toString();
const tsconfig = eval(`() => (${tsconfigRaw})`)();
const paths = tsconfig.compilerOptions.paths;

module.exports = {
  stats: 'minimal',
  mode: 'development',
  entry: [path.resolve(__dirname, 'entry.js'), 'webpack-hot-middleware/client'],
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: './',
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 0,
              name: 'assets/[hash].[ext]'
            },
          },
        ],
      },
    ],
  },
  devtool: 'inline-source-map',
  target: 'web',
  plugins: [
    new CleanWebpackPlugin({ default: ['dist'] }),
    new HtmlWebpackPlugin({ template: 'public/index.html' }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: Object
      .keys(paths)
      .filter(key => key.slice(-1) === '*')
      .reduce((acc, key) => Object.assign(acc, {[key.slice(0, -2)]: path.resolve(__dirname, '..', paths[key][0].slice(0, -2))}), {})
    ,
  },
  optimization: {
    minimize: false,
    minimizer: [],
  },
};