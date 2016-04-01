'use strict';

//creates zip files for each Lambda function folder

var gulp   = require('gulp');
var zipdir = require('zip-dir');
var config = require('../config');
var fs = require('fs');
var src = config.lambda_zip.temp;
var dest = config.lambda_zip.dest;

gulp.task('lambda_zip', function() {
	var folders = fs.readdirSync(src).filter(function(item){
		return item.substring(0,1) !== ".";  //remove folders staring with .
	});
	console.log(folders);

	//For each folder
	folders.forEach(function(folder) {
	  //make zip
	  console.log(src + folder + '/');

	  zipdir(src + folder + '/', { saveTo: dest + folder + ".zip" }, function (err, buffer) {
	  	if (err) return console.error(err)
	  	console.log('zip success!');
	  })

	});
});