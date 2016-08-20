'use strict'
const path = require(`path`),
      webpack = require(`webpack`);
const BANNER = `Simple Patcher Tree-maker\n` + 
  `Roseller M. Velicaria, Jr.\n` + 
  `github.com/devars\n` + 
  `${new Date()}`;
let config = {
      entry: './src/js/index.js',
      output: {
        path: __dirname,
        filename: 'dist/main.js'
      },
      module: {
        loaders: [
          getFontLoaders(),
          getCSSLoaders(),
          getHTMLLoaders(),
          getJSLoaders()
        ]
      },
      plugins: [new webpack.BannerPlugin(BANNER, {entryOnly: true})],
      jshint: {
        node: true
      }
    };

if (process.env.NODE_ENV === `PROD`) {
  config.plugins.push(new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({compress:{}})
  );
}

if (process.env.NODE_ENV === `DEV`) {
  config.devtool = `source-map`;
}

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
    loaders: ['file?name=dist/[sha512:hash:base64].[ext]']
  }
}

module.exports = config;