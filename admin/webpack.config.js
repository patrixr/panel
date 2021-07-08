const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './main.ts',
  mode: /prod/.test(process.env.NODE_ENV) ? 'production' : 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: "webpack.tsconfig.json"
          }
        }],
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist/admin'),
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        BASE_URL: process.env.BASE_URL || null
      })
    })
  ]
}
