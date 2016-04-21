'use strict'

var assert = require('assert-plus');
var DOC = require("dynamodb-doc");
var uuid = require('uuid');
var dbClient = new DOC.DynamoDB();
var USERS = 'exploregame_players';
var OBJECTS = 'exploregame_objects';

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

//adds new players to users
exports.addPlayer = function(event, context){
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
		assert.string(event.name, 'event.name');
		assert.object(event.currentZone, 'event.currentZone');
		assert.object(event.position, 'event.position');
		assert.string(event.color, 'event.color');		
	} catch (error) {
		context.fail('Assert: ' + error.message);
		return;
	}

	var reqObj = {
		TableName: USERS,
		Item: {
			username: event.name,
			score: 0,
			currentZone: event.currentZone,
			position: event.position,
			color: event.color
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
};

//adds 10 new objects to a zone
exports.addObjectS = function(event, context){
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
		assert.object(event.zone, 'event.zone')
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
				zone: event.zone,
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

//adds 1 new object to a zone
exports.addObject = function(event, context){
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
		assert.object(event.zone, 'event.zone')
	} catch (error) {
		context.fail('Assert: ' + error.message);
		return;
	}
	var pick = Math.floor(Math.random()*color.length);
	var colorpick = color[pick];

	var reqObj = {
		TableName: OBJECTS,
		Item: {
			id: uuid.v4(),
			score: colorpick.score,
			color: colorpick.color,	
			zone: event.zone,
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
};