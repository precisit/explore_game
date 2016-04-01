'use strict';
//move Lambda sdk files to build folder
var config      = require('../config');
var changed     = require('gulp-changed');
var gulp        = require('gulp');
var gulpif      = require('gulp-if');
var browserSync = require('browser-sync');

gulp.task('lambda_SDK', function() {

  return gulp.src(config.lambda_SDK.src)
    .pipe(changed(config.lambda_SDK.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.lambda_SDK.dest))
    .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true, once: true })));

});