'use strict';
//for each lambda zip file it checks if that Lambda function exists
//if it exists it is updated with the new zip file
//if it does not exist a new Lambda function is created with that zip file

var gulp   = require('gulp');
var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');
var argv = require('yargs').argv;
var uuid = require('uuid');
var config = require('../config');
var new_lambda_config = require('../../Lambda/config');

var src = config.lambda_zip.dest;
var prefix = config.lambda_zip.prefix;

AWS.config.update({region: config.lambda_zip.region});
var lambda = new AWS.Lambda();
var apigateway = new AWS.APIGateway();

gulp.task('lambda_upload', /*['lambda_zip'],*/ function() {
	//get all Lambda functions
	lambda.listFunctions({}, function(error, data) {
	  if (error) return console.error(error);
	  else {     // successful response
	  	var existingLambdaNames = [];
	  	var existingLambdas = data.Functions;
	  	existingLambdas.forEach(function(existingLambda){
			existingLambdaNames.push(existingLambda.FunctionName);
		});

		//get all zip folders
		var zips = fs.readdirSync(src).filter(function(item){
			return item.substring(0,1) !== ".";  //remove folders staring with .
		});

		//For each zip file
		zips.forEach(function(zip) {
			var zipFile = zip;
			var zipSplit = zip.split('.');
			var fileName = zipSplit[0];
			var functionName = zipSplit[1];
			//name of the Lambda
			var lambdaName = prefix + '_' + fileName + '_' + functionName;
			var functionName = fileName + '_' + functionName;
			var index = existingLambdaNames.indexOf(lambdaName);

			if(index === -1){ //function does not exist
				createNew(zipFile, functionName, lambdaName);
			} else { //function exist on index 
				update(zipFile, lambdaName);
			}
		});
	  }
	});
});

//Updates existing Lambda function with new code
function update(zipFile, lambdaName){
	var params = {
	  FunctionName: lambdaName,
	  ZipFile: fs.readFileSync(src + zipFile) 
	};
	lambda.updateFunctionCode(params, function(error, data) {
	  if (error) {  // an error occurred
	  	return console.error(error);
	  } 
	  else {   // successful response
	  	console.log("successful update of lambda " + lambdaName);
	  }         
	});
}

//Creates a new Lambda function
function createNew(zipFile, functionName, lambdaName){
	console.log(functionName); 
	if(argv.new){ //TODO: check if flag is set
		var configs = new_lambda_config.list[functionName];
		if(!configs){
			console.log("Warning! Configurations have to be set for new Lambdas (" + lambdaName + ")")
		} 
		else {
			console.log("Found configs (" + lambdaName + ")");
			var api_id = new_lambda_config.api_id;
			var root_id = new_lambda_config.root_id;
			var role = configs.role;
			var method = configs.method;
			var resource = configs.resource;
			var description = configs.description;

			var params = {
			  Code: {
			    ZipFile: fs.readFileSync(src + zipFile) 
			  },
			  FunctionName: lambdaName, 
			  Handler: path.basename(zipFile, '.zip'), 
			  Role: role,
			  Runtime: 'nodejs',
			  Description: description
			};
			//create Lambda function 
			lambda.createFunction(params, function(error, data) {
			  if (error) {  // an error occurred
			  	return console.error(error);
			  } 
			  else {   // successful response
			  	console.log("successful upload of lambda " + lambdaName);
			  	var functionArn = data.FunctionArn;
			  	//get all current resources
				apigateway.getResources({restApiId: api_id}, function(err, data) {
  					if (err) console.error(err);
  					else{     
  						var existingResources = data.items;
  						var existingResourcesNames = [];
  						existingResources.forEach(function(existingResource){
							existingResourcesNames.push(existingResource.pathPart);
						});


						var r_index = existingResourcesNames.indexOf(resource);

						var resource_id;
						if(r_index === -1){
							params = {
							  parentId: root_id, 
							  pathPart: resource,
							  restApiId: api_id
							};
							apigateway.createResource(params, function(err, data) {
							  if (err) console.error(err);
							  else {
							  	resource_id = data.id;
							  	createMethod(functionName, lambdaName, method, resource_id, api_id, resource, functionArn);
							  }
							});


						} else {
							resource_id = existingResources[i].id;
							createMethod(functionName, lambdaName, method, resource_id, api_id, resource, functionArn);
						}
  					}
				})

			  }     
			});
		}
	} 
	else {
		console.log("Warning! New Lambda functions have to be added manually using config and flag --new (" + lambdaName + ")");
	}

}

//continue api settings starting from create method
function createMethod(functionName, lambdaName, method, resource_id, api_id, resource, functionArn){
	var params = {
	  authorizationType: 'NONE',
	  httpMethod: method,
	  resourceId: resource_id,
	  restApiId: api_id,
	};
	apigateway.putMethod(params, function(err, data) {
	  if (err) console.error(err);
	  else { 
	  	var uri = 'arn:aws:apigateway:' + config.lambda_zip.region + ':lambda:path/2015-03-31/functions/arn:aws:lambda:' + config.lambda_zip.region + ':' + new_lambda_config.acc_id + ':function:' + lambdaName + '/invocations';

	  	params = {
		  httpMethod: method,
		  resourceId: resource_id,
		  restApiId: api_id,
		  type: 'AWS',
		  integrationHttpMethod: method,
		  uri: uri
		};
		apigateway.putIntegration(params, function(err, data) {
		  if (err) console.error(err);
		  else { 
		  	params = {
			  httpMethod: method,
			  resourceId: resource_id,
			  restApiId: api_id,
			  statusCode: '200',
			  responseModels: {
			    'application/json': 'Empty'
			  }
			};
			apigateway.putMethodResponse(params, function(err, data) {
			  if (err) console.error(err);
			  else {
			  	params = {
				  httpMethod: method,
				  resourceId: resource_id,
				  restApiId: api_id,
				  statusCode: '200',

				  responseTemplates: {
				    'application/json': '',
				  },
				};
				apigateway.putIntegrationResponse(params, function(err, data) {
				  if (err) console.error(err);
				  else {
					params = {
					  httpMethod: method,
					  resourceId: resource_id,
					  restApiId: api_id,
					  statusCode: '400',
					  responseModels: {
					    'application/json': 'Error'
					  }
					};
					apigateway.putMethodResponse(params, function(err, data) {
					  if (err) console.error(err);
					  else {
					  	params = {
						  httpMethod: method,
						  resourceId: resource_id,
						  restApiId: api_id,
						  statusCode: '400',

						  selectionPattern: 'Assert.*'
						};
						apigateway.putIntegrationResponse(params, function(err, data) {
						  if (err) console.error(err);
						  else {
						  	params = {
							  restApiId: api_id,
							  stageName: 'prod',
							};
							apigateway.createDeployment(params, function(err, data) {
							  if (err) console.error(err);
							  else {
								params = {
								  Action: 'lambda:InvokeFunction',
								  FunctionName: functionArn,
								  Principal: 'apigateway.amazonaws.com',
								  StatementId: uuid.v4(),
							  	  SourceArn: 'arn:aws:execute-api:' + config.lambda_zip.region + ':' + new_lambda_config.acc_id + ':' + api_id + '/*/' + method + '/' + resource
								};
								lambda.addPermission(params, function(err, data) {
								  if (err) console.error(err);
								  else {
									params = {
									  Action: 'lambda:InvokeFunction',
									  FunctionName: functionArn,
									  Principal: 'apigateway.amazonaws.com',
									  StatementId: uuid.v4(),
									  SourceArn: 'arn:aws:execute-api:' + config.lambda_zip.region + ':' + new_lambda_config.acc_id + ':' + api_id + '/prod/' + method + '/' + resource
									};
									lambda.addPermission(params, function(err, data) {
									  if (err) console.error(err);
									  else {
									  	console.log("API gateway integration successful! (" + lambdaName + ")");
									  }
									});
								  }
								});
							  }
							});

						  }
						});
					  }
					});
				  }
				});
			  }
			});

		  }
		});

	  }
	});
}

