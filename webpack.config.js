const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack")
module.exports = {
    entry: './src/index.js',
    output: {
    filename: 'index.js',
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
  plugins: [
    new HtmlWebPackPlugin({
        template: "./public/index.html"
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
};