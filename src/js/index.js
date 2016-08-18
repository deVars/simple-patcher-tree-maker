require('angular-material/angular-material.css')
require('font-awesome/css/font-awesome.css')
require('../css/app.css');

const angular = require('angular');
require('angular-animate');
require('angular-aria');
require('angular-material');

var app = angular
  .module('dv-sptm', ['ngMaterial'])
  .controller('MainCtrl', function() {});

require('./filters')(app);
require('./Main')(app);
require('./TreeEntry')(app);
require('./TreeContainer')(app);