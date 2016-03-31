'use strict'

var assert = require('assert-plus');

exports.randomScore = function(event, context){
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
	} catch (error) {
		context.fail('Assert: ' + error.message);
		return;
	}

	var randomNumber = Math.floor((Math.random() * 10) + 1);
	context.done(null, randomNumber);
};

exports.collision = function(event, context){
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
	} catch (error) {
		context.fail('Assert: ' + error.message);
		return;
	}

	var randomNumber = Math.floor((Math.random() * 10) + 1);
	context.done(null, randomNumber);
};