'use strict';

//creates zip files for each Lambda function folder

var gulp   = require('gulp');
var zip   = require('gulp-zip');
var fs = require('fs-extra');
var config = require('../config');
var src = config.lambda_zip.temp;
var dest = config.lambda_zip.dest;
require('es6-promise').polyfill();

	var fn = function zipping(folder){
		return new Promise (function(resolve, reject) {
			gulp.src(src+folder+"/**/*")
        	.pipe(zip(folder+".zip"))
        	.on('error', reject)
        	.pipe(gulp.dest(dest))
        	.on('end', resolve)
		});
	}

gulp.task('lambda_zip', /*['lambda_archives'],*/ function() {
	var folders = fs.readdirSync(src).filter(function(item){
		return item.substring(0,1) !== ".";  //remove folders staring with .
	});
	return Promise.all(folders.map(fn));
});