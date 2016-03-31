'use strict';

//zips the Lambda function folders

var gulp   = require('gulp');
var zipdir = require('zip-dir');
var config = require('../config');
var fs = require('fs');

gulp.task('lambda_zip', function() {
	var folders = fs.readdirSync(config.lambda_zip.src).filter(function(item){
		return item.substring(0,1) !== ".";  //remove folders staring with .
	});
	console.log(folders);

	//For each folder
	folders.forEach(function(folder) {
	  //make zip
	  console.log(config.lambda_zip.src + folder + '/');

	  zipdir(config.lambda_zip.src + folder + '/', { saveTo: config.lambda_zip.dest + folder + ".zip" }, function (err, buffer) {
	  	if (err) return console.error(err)
	  	console.log('zip success!');
	  })

	});
});