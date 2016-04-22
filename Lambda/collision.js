'use strict'

var assert = require('assert-plus');
var DOC = require("dynamodb-doc");
var dbClient = new DOC.DynamoDB();
var OBJECTS = 'exploregame_objects';
var USERS = 'exploregame_players';
var hashAuthToken = require('hash-auth-token')('long and random string');

//Retrieves the score for an object
//Adds score to player and returns total score
exports.objectCollision = function(event, context){
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
		assert.string(event.obj_id, 'event.obj_id');
		assert.string(event.token, 'event.token');
	} catch (error) {
		context.fail('Assert: ' + error.message);
		return;
	}

	var user;
	try {
		user = hashAuthToken.verify(event.token);
	}
	catch (e) {
		context.fail('Error: Incorrect token (' + event.token + ')');
		return;
	}

	var reqObj = {
		TableName: OBJECTS,
		Key: {
			id: event.obj_id
		}
	};

	dbClient.getItem(reqObj, function(err, data) {
		if (err) {
			console.log(err.stack);
			context.fail('Exception: ' + err.message)
		}  else if (!data.Item) {
	    	context.fail('Error: Bad obj_id (' + event.obj_id + ') , object does not exist');
		} else {
			//add score to player
			var score = data.Item.score;

			var reqObj = {
				TableName: USERS,
				Key: {
					username: user.username			
				},
				UpdateExpression: "set score = score + :val1",
				ExpressionAttributeValues:{
		        	":val1": score
		    	},

				ReturnValues: "ALL_NEW"
			}

			dbClient.updateItem(reqObj, function(err, data) {
				if (err) {
					console.log(err.stack);
					context.fail('Error: Unknown internal error.')
				} else {
					context.done(null, data.Attributes.score);
				}

			});
		}
	});
};