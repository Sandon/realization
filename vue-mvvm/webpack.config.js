/**
 * Created by lipeng on 2018/11/28.
 */
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: './src/vm.js'
  },
  output: {
    filename: 'vm.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
