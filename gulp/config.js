'use strict';

module.exports = {

  'browserPort'  : 3000,
  'UIPort'       : 3001,
  'serverPort'   : 3002,

  'styles': {
    'src' : 'app/styles/**/*.scss',
    'dest': 'build/css',
    'prodSourcemap': false,
    'sassIncludePaths': ['./node_modules/bootstrap-sass/assets/stylesheets']
  },

  'scripts': {
    'src' : 'app/js/**/*.js',
    'dest': 'build/js'
  },

  'images': {
    'src' : 'app/images/**/*',
    'dest': 'build/images'
  },

  'fonts': {
    'src' : ['node_modules/bootstrap-sass/assets/fonts/**/*', 'app/fonts/**/*'],
    'dest': 'build/fonts'
  },

  'views': {
    'watch': [
      'app/index.html',
      'app/views/**/*.html'
    ],
    'src': 'app/views/**/*.html',
    'dest': 'app/js'
  },

  'lambda_SDK': {
    'src': 'app/lambda_SDK/**/*',
    'dest': 'build/lambda_SDK'
  },

  'lambda_zip': {
    'src': 'Lambda/',
    'temp': 'build/archives/',
    'dest': 'build/zip/',
    'prefix': 'exploregame', 
    'region': 'us-west-2',
  },

  'gzip': {
    'src': 'build/**/*.{html,xml,json,css,js,js.map,css.map}',
    'dest': 'build/',
    'options': {}
  },

  'dist': {
    'root'  : 'build'
  },

  'browserify': {
    'entries'   : ['./app/js/main.js'],
    'bundleName': 'main.js',
    'prodSourcemap' : false
  },

  'test': {
    'karma': 'test/karma.conf.js',
    'protractor': 'test/protractor.conf.js'
  }

};
