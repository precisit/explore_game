'use strict';
//creates a folder for each Lambda function with js file and node modules

var gulp   = require('gulp');
var config = require('../config');
var fs = require('fs-extra');
var path = require('path');
var gulpIgnore = require('gulp-ignore');
var Q = require("q");
var onlyScripts = require('../util/scriptFilter');
var functionExtractor = require("function-extractor");
var src = config.lambda_zip.src;
var dest = config.lambda_zip.temp;
var filename;
var funcNames;
var folder;

gulp.task('lambda_archives', function() {

var promises = [];
var files = fs.readdirSync(src).filter(onlyScripts);
	var defer = Q.defer();
	var filename;
	var funcNames;
	var folder;

	//For each file
	files.forEach(function(file) {
	  filename = path.basename(file, '.js');
	  funcNames = getFunctionNames(src + "/" + file)

	  //for each function in the file
	  funcNames.forEach(function(funcName){

		folder = dest + filename + "." + funcName + "/";
	  	var pipeline = gulp.src(src + "**/*")
		.pipe(gulpIgnore.include(['node_modules/**/*', filename + ".js"]))
		.pipe(gulp.dest(folder));

		pipeline.on('end', function() {
			defer.resolve();
		});
		promises.push(defer.promise);
	  });
		
	});
return Q.all(promises);

});

//returns list of all function names in file
function getFunctionNames(file){
    var source = fs.readFileSync(file, "utf8")
    var functions = functionExtractor.parse(source);
    var functionNames = [];
    functions.forEach(function(func) {
    	if(func.namespace === 'exports')
    	functionNames.push(func.name);
    });
	return functionNames;
}