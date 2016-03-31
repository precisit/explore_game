'use strict';
var gulp   = require('gulp');
var config = require('../config');
var fs = require('fs-extra');
var path = require('path');
var onlyScripts = require('../util/scriptFilter');
var functionExtractor = require("function-extractor");

gulp.task('lambda_archives', function() {
	var files = fs.readdirSync(config.lambda_archive.src).filter(onlyScripts);

	var filename;
	var funcNames;
	var folder;

	//For each file
	files.forEach(function(file) {
	  //console.log(file);
	  filename = path.basename(file, '.js');
	  //console.log(filename);

	  
	  funcNames = getFunctionNames(config.lambda_archive.src + "/" + file)
	  //for each function
	  funcNames.forEach(function(funcName){

	  	//create folder
	  	folder = config.lambda_archive.dest + filename + "." + funcName;
	  	fs.mkdirs(folder, function (error) {
	  		if (error) return console.error(error)
	  		//console.log("success!")
		});  	

		//move node_modules
		fs.copy(config.lambda_archive.src + "/node_modules", folder + "/node_modules", function (err) {
	  		if (err) return console.error(err)
	  		//console.log('success!');
		})

	  	//move js file
	  	fs.copy(config.lambda_archive.src + "/" + file, folder + "/" + file, function (error) {
	  		if (error) return console.error(error)
	  		//console.log("success!")
		});
	  });
		
	});
});
//returns list of all function names in file
function getFunctionNames(file){
	//TODO: make this function
    var source = fs.readFileSync(file, "utf8")
    var functions = functionExtractor.parse(source);
    //console.log(functions);
    var functionNames = [];

    functions.forEach(function(func) {
    	if(func.namespace === 'exports')
    	functionNames.push(func.name);
    });
    //console.log(functionNames);
	return functionNames;
}