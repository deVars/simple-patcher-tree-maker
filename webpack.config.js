'use strict'
const path = require('path');
let config = {
      entry: './src/js/index.js',
      output: {
        path: __dirname,
        filename: 'main.js'
      },
      module: {
        loaders: [
          getFontLoaders(),
          getCSSLoaders(),
          getHTMLLoaders(),
          getJSLoaders()
        ]
      },
      devtool: 'source-map',
      jshint: {
        node: true
      }
    };

function getCSSLoaders() {
  return {
    test: /\.css$/,
    loaders: ['style', 'css']
  };
}

function getJSLoaders() {
  return {
    test: /\.js$/,
    exclude: /node_modules/,
    loaders: ['jshint', 'ng-annotate', 'babel?presets[]=es2015&plugins[]=add-module-exports']
  };
}

function getHTMLLoaders() {
  return {
    test: /\.html$/,
    exclude: /node_modules/,
    loaders: ['html?-attrs']
  };
}

function getFontLoaders() {
  return {
    test: /\.(eot|woff2?|svg|ttf)(\?v=\d\.\d\.\d)?/,
    loaders: ['file']
  }
}

module.exports = config;