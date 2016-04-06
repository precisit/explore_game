'use strict';

var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('dev', ['clean'], function(cb) {

  cb = cb || function() {};

  global.isProd = false;

  runSequence(['styles', 'images', 'fonts', 'lambda_SDK', 'lambda_upload', 'views', 'browserify'], 'watch', cb);

});