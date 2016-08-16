// const angular = require('angular');
const angular = require('angular');
require('angular-animate');
require('angular-aria');
require('angular-material');

require('../../node_modules/angular-material/angular-material.css')
require('../../node_modules/font-awesome/css/font-awesome.css')
require('../css/app.css');

var app = angular.module('dv-sptm', ['ngMaterial']);

require('./controllers')(app);
require('./directives')(app);
require('./filters')(app);