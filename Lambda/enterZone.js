'use strict'

var assert = require('assert-plus');
var DOC = require("dynamodb-doc");
var dbClient = new DOC.DynamoDB();
var USERS = 'exploregame_players';
var OBJECTS = 'exploregame_objects';
var uuid = require('uuid');
var hashAuthToken = require('hash-auth-token')('long and random string');

var color = [
	{
		color: '#22AAFF',
		score: 10
	},
	{
		color: '#EE0000',
		score: 5
	},
	{
		color: '#22AA00',
		score: 1
	}
]

//update current zone for player
exports.saveCurrentZone = function(event, context){
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
		assert.string(event.token, 'event.token');
		assert.object(event.currentZone, 'event.currentZone');	
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
		TableName: USERS,
		Key: {
			username: user.username			
		},
		UpdateExpression: "set currentZone = :val1",
		ExpressionAttributeValues:{
        	":val1": event.currentZone
    	},

		ReturnValues: "ALL_NEW"
	}

	dbClient.updateItem(reqObj, function(err, data) {
		if (err) {
			console.log(err.stack);
			context.fail('Exception: Unknown internal error.')
		} else {
			context.done(null, data.Attributes);
		}

	});
};

//return all objects in a zone
exports.getObjects = function(event, context){
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
		assert.object(event.currentZone, 'event.currentZone');
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
		FilterExpression: "#key = :value",
		ExpressionAttributeNames: {
			"#key": "zone"
		},
		ExpressionAttributeValues: {
			":value": event.currentZone
		}
	};

	dbClient.scan(reqObj, function(err, data) {
		if (err) {
			console.log(err.stack);
			context.fail('Exception: ' + err.message)
		} else {
			context.done(null, data.Items);
		}
	});
};

//return all players in a zone
exports.getPlayers = function(event, context){
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
		assert.object(event.currentZone, 'event.currentZone');
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
		TableName: USERS,
		FilterExpression: "#key = :value",
		ExpressionAttributeNames: {
			"#key": "currentZone"
		},
		ExpressionAttributeValues: {
			":value": event.currentZone
		}
	};

	dbClient.scan(reqObj, function(err, data) {
		if (err) {
			console.log(err.stack);
			context.fail('Exception: ' + err.message)
		} else {
			context.done(null, data.Items);
		}
	});
};

exports.addObjects = function(event, context){
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
		assert.object(event.currentZone, 'event.currentZone')
	} catch (error) {
		context.fail('Assert: ' + error.message);
		return;
	}
	for(var i = 0; i < 10; i++){
		var pick = Math.floor(Math.random()*color.length);
		var colorpick = color[pick];

		var reqObj = {
			TableName: OBJECTS,
			Item: {
				id: uuid.v4(),
				score: colorpick.score,
				color: colorpick.color,	
				zone: event.currentZone,
				position: {
					x: Math.random()*1920,
					y: Math.random()*1080
				}
			}
		}

		dbClient.putItem(reqObj, function(err, data) {
			if (err) {
				console.log(err.stack);
				context.fail('Error: Unknown internal error.')
			} else {
				context.done(null, reqObj.Item);
			}

		});
	}
};
