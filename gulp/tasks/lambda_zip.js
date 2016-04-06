'use strict';

//creates zip files for each Lambda function folder

var gulp   = require('gulp');
var zip   = require('gulp-zip');
var foreach = require('gulp-foreach');
var config = require('../config');
var src = config.lambda_zip.temp;
var dest = config.lambda_zip.dest;


gulp.task('lambda_zip', ['lambda_archives'], function() {

	return gulp.src(src + '*')
	  .pipe(foreach(function(stream, file){
	  	var fileName = file.path.substr(file.path.lastIndexOf("/")+1);
        gulp.src(src+fileName+"/**/*")
        .pipe(zip(fileName+".zip"))
        .pipe(gulp.dest(dest));

        return stream;
	  }));
});