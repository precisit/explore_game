'use strict'

var assert = require('assert-plus');
var DOC = require("dynamodb-doc");
var dbClient = new DOC.DynamoDB();
var OBJECTS = 'exploregame_objects';
var USERS = 'exploregame_users';

//Retrieves the score for an object
//Adds score to player and returns total score
exports.objectCollision = function(event, context){
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
		assert.string(event.obj_id, 'event.obj_id');
		assert.string(event.user_id, 'event.user_id');
	} catch (error) {
		context.fail('Assert: ' + error.message);
		return;
	}

	var reqObj = {
		TableName: OBJECTS,
		FilterExpression: "#key = :value",
		ExpressionAttributeNames: {
			"#key": "id"
		},
		ExpressionAttributeValues: {
			":value": event.obj_id
		}
	};

	dbClient.scan(reqObj, function(err, data) {
		if (err) {
			console.log(err.stack);
			context.fail('Exception: ' + err.message)
		} else {
			//add score to player
			var score = data.Items[0].score;

			var reqObj = {
				TableName: USERS,
				Key: {
					id: event.user_id			
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