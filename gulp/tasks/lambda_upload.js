'use strict';
//for each lambda zip file it checks if that Lambda function exists
//if it exists it is updated with the new zip file
//if it does not exist a new Lambda function is created with that zip file

var gulp   = require('gulp');
var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');
var config = require('../config');

var src = config.lambda_zip.dest;
var prefix = config.lambda_zip.prefix;
var role = config.lambda_zip.role;

AWS.config.update({region: config.lambda_zip.region});
var lambda = new AWS.Lambda();
var existingLambdas;
var existingLambdaNames = [];
var fileName;
var functionName;
var zipSplit;
var lambdaName;
var index;
var zipFile;

gulp.task('lambda_upload', function() {
	//get all zip folders
	var zips = fs.readdirSync(src).filter(function(item){
		return item.substring(0,1) !== ".";  //remove folders staring with .
	});
	
	var params = {};
	//get all Lambda functions
	lambda.listFunctions(params, function(error, data) {
	  if (error) return console.error(error);
	  else {     // successful response
	  	//
	  	existingLambdas = data.Functions;
	  	existingLambdas.forEach(function(existingLambda){
			existingLambdaNames.push(existingLambda.FunctionName);
		});

		//For each zip file
		zips.forEach(function(zip) {
			zipFile = zip;
			zipSplit = zip.split('.');
			fileName = zipSplit[0];
			functionName = zipSplit[1];
			//name of the Lambda
			lambdaName = prefix + '_' + fileName + '_' + functionName;
			index = existingLambdaNames.indexOf(lambdaName);

			if(index === -1){ //function does not exist
				createNew();
			} else { //function exist on index 
				update();
			}
		});
	  }
	});
});

//Updates existing Lambda function with new code
function update(){
	var params = {
	  FunctionName: lambdaName,
	  ZipFile: fs.readFileSync(src + zipFile) 
	};
	lambda.updateFunctionCode(params, function(error, data) {
	  if (error) {  // an error occurred
	  	return console.error(error);
	  } 
	  else {   // successful response
	  	console.log("successful update of lambda");
	  }         
	});
}

//Creates a new Lambda function
function createNew(){
	var params = {
	  Code: {
	    ZipFile: fs.readFileSync(src + zipFile) 
	  },
	  FunctionName: lambdaName, 
	  Handler: path.basename(zipFile, '.zip'), 
	  Role: role,
	  Runtime: 'nodejs',

	};
	lambda.createFunction(params, function(error, data) {
	  if (error) {  // an error occurred
	  	return console.error(error);
	  } 
	  else {   // successful response
	  	console.log("successful upload of lambda");
	  }     
	});

}



