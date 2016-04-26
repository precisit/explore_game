'use strict';
//sequentially performs all the steps of uploading/updating a Lambda function
var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var fs = require('fs');
 
gulp.task('lambda', function(callback) {
  runSequence(//'clean',   //TODO:task that removes only archive and zip folder
              'lambda_archives',
              'lambda_zip',
              'lambda_upload');
});