'use strict'

var assert = require('assert-plus');
var DOC = require("dynamodb-doc");
var dbClient = new DOC.DynamoDB();
var hashAuthToken = require('hash-auth-token')('long and random string');

var LOGIN = 'exploregame_login';
var USERS = 'exploregame_players';
var errorPhrase = 'Error: Wrong username or password';

//checks username and password and returns token if valid
exports.login = function(event, context) {
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
		assert.string(event.username, 'event.username');
		assert.string(event.password, 'event.password');
	} catch (error) {
		context.fail('Assert: ' + error.message);
		return;
	}


	var username = event.username;
	var password = event.password;

	var reqObj = {
		TableName: LOGIN,
		Key: {
			username: username
		}
	};

	dbClient.getItem(reqObj, function(err, data) {
		if (err) {
			console.log(err.stack);
			context.fail('Exception: ' + err.message);
		} else if (!data.Item) {
	    	context.fail(errorPhrase);
		} else { 
			if (password !== data.Item.password){
				context.fail(errorPhrase + " " + password + " " + data.Item.password);
			} else {
				var token = hashAuthToken.generate({username: username}, 3600); 
				context.done(null, {token: token});
			}
		}
	});
}

//retrieves userinformation if token is valid
exports.get = function(event, context) {
	try {
		assert.object(event, 'event');
		assert.object(context, 'context');
		assert.string(event.token, 'event.token');
	} catch (error) {
		context.fail('Assert: ' + error.message);
		return;
	}

	var user = hashAuthToken.verify(event.token);

	var reqObj = {
		TableName: USERS,
		Key: {
			username: user.username
		}
	};

	dbClient.getItem(reqObj, function(err, data) {
		if (err) {
			console.log(err.stack);
			context.fail('Exception: ' + err.message);
		} else if (!data.Item) {
	    	context.fail('Error: Bad username, user does not exist');
		} else { 
			context.done(null, data.Item);
		}
	});

}