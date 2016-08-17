require('angular-material/angular-material.css')
require('font-awesome/css/font-awesome.css')
require('../css/app.css');

const angular = require('angular');
require('angular-animate');
require('angular-aria');
require('angular-material');

var app = angular.module('dv-sptm', ['ngMaterial']);

require('./controllers')(app);
require('./filters')(app);
require('./TreeEntry')(app);
require('./TreeContainer')(app);