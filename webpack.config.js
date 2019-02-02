const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require("webpack")
module.exports = {
    entry: './src/index.js',
    output: {
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        proxy: {
          '/api': 'http://localhost:3001'
        }
    },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
        },
        {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 2500000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
        template: "./public/index.html"
    }),
    new LodashModuleReplacementPlugin({'shorthands':true}),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
};