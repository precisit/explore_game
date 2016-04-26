'use strict';
//creates a folder for each Lambda function with js file and node modules

var gulp   = require('gulp');
var config = require('../config');
var fs = require('fs-extra');
var path = require('path');
var gulpIgnore = require('gulp-ignore');
var onlyScripts = require('../util/scriptFilter');
var functionExtractor = require("function-extractor");
var src = config.lambda_zip.src;
var dest = config.lambda_zip.temp;




gulp.task('lambda_archives', function() {
	var files = fs.readdirSync(src).filter(onlyScripts);

	var res = Promise.all(files.map(getnames))
	.then(function(data){
		var arr = data[0];
		for(var i = 1; i < data.length; i++){
			arr = arr.concat(data[i]);
		}
		return arr;
		//return Promise.all(data.map(cp))
	})
	.then(function(data){
		return Promise.all(data.map(cp))
	})

	return res;
});

//returns list of all function names in file
var getnames = function getFunctionNames(file){
    var source = fs.readFileSync(src + "/" + file, "utf8")
    var functions = functionExtractor.parse(source);
    var functionNames = [];
    functions.forEach(function(func) {
    	if(func.namespace === 'exports')
    	functionNames.push({name: func.name, file: file});
    });
	return new Promise(resolve => resolve(functionNames));
}

//copies file and dependencies
var cp = function copy(names){
	var filename = path.basename(names.file, '.js');
	var funcName = names.name;
	return new Promise(function(resolve, reject){
		gulp.src(src + "**/*")
		.pipe(gulpIgnore.include(['node_modules/**/*', filename + ".js"]))
		.on('error', reject)
		.pipe(gulp.dest(dest + filename + "." + funcName + "/"))
		.on('end', resolve)
	})
}
