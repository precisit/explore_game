'use strict';
//creates a folder for each Lambda function with js file and node modules

var gulp   = require('gulp');
var config = require('../config');
var fs = require('fs-extra');
var path = require('path');
var onlyScripts = require('../util/scriptFilter');
var functionExtractor = require("function-extractor");
var src = config.lambda_zip.src;
var dest = config.lambda_zip.temp;

gulp.task('lambda_archives', function() {
	var files = fs.readdirSync(src).filter(onlyScripts);

	var filename;
	var funcNames;
	var folder;

	//For each file
	files.forEach(function(file) {
	  //console.log(file);
	  filename = path.basename(file, '.js');
	  //console.log(filename);

	  
	  funcNames = getFunctionNames(src + "/" + file)
	  //for each function
	  funcNames.forEach(function(funcName){

	  	//create folder
	  	folder = dest + filename + "." + funcName;
	  	fs.mkdirs(folder, function (error) {
	  		if (error) return console.error(error)
	  		//console.log("success!")
		});  	

		//move node_modules
		fs.copy(src + "/node_modules", folder + "/node_modules", function (err) {
	  		if (err) return console.error(err)
	  		//console.log('success!');
		})

	  	//move js file
	  	fs.copy(src + "/" + file, folder + "/" + file, function (error) {
	  		if (error) return console.error(error)
	  		//console.log("success!")
		});
	  });
		
	});
});

//returns list of all function names in file
function getFunctionNames(file){
    var source = fs.readFileSync(file, "utf8")
    var functions = functionExtractor.parse(source);
    //console.log(functions);
    var functionNames = [];

    functions.forEach(function(func) {
    	if(func.namespace === 'exports')
    	functionNames.push(func.name);
    });
    console.log(functionNames);
	return functionNames;
}