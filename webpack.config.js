const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');

let exportsObject = {

  devtool: (NODE_ENV == 'production') ? false : 'module-inline-sourcemap',

  context: __dirname,

  entry: {
    app: './src/index.js',
    style: './src/scss/index.sass'
  },

  output: {
    filename: '[name].js',
    path: './static',
    publicPath: '/static/'
  },

  resolve: {
    root: path.join(__dirname),
    extensions: ['', '.json', '.js', '.jsx', '.scss', '.sass', '.css']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        },
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.sass$/,
        include: path.join(__dirname, 'src', 'scss'),
        loader: ExtractTextPlugin.extract('css!resolve-url!sass?sourceMap')
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': NODE_ENV,
    }),
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    })
  ]
};

if (NODE_ENV == 'production') {
  exportsObject.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      comments: false,
      compress: {
        warnings: false
      }
    })
  );
    exportsObject.plugins.push(
    new webpack.optimize.DedupePlugin()
  );
}

module.exports = exportsObject;