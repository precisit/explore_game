'use strict';

var controllersModule = require('./_index');
var d3 = require('d3');
var uuid = require('uuid');

var GameEngine = require('../game/GameEngine');

/**
 * @ngInject
 */
function ExampleCtrl($window) {

	console.log(d3);

	// Create one instance of our game
	var gameEngine = new GameEngine($window);

	// Add some objects into game - TODO: Get from lambda
	for(var i = 0; i < 10; i++) {
		gameEngine.addGenericObject('generic', uuid.v4(), Math.random()*1920, Math.random()*1080);
	}

	// Act on callback when Object is hit
	gameEngine.on('collision', function(object) {
		console.log('Hit with object type ' + object.type, object);

		// Just for fun - add new object to scene (TODO: Get from lambda + add different types for player <-> player trading)
		gameEngine.addGenericObject('generic', uuid.v4(), Math.random()*1920, Math.random()*1080);

		// Also just for fun, add static score 1 when object is hit
		gameEngine.player.score += 1;
	});

	// Act on player moving into new sector
	gameEngine.on('sector', function(newSector) {
		console.log('Player just moved into sector', newSector); // TODO: Get sector data from lambda + populate objects, etc as needed.
	});

	// Start the game loop
	gameEngine.loop();
}

controllersModule.controller('ExampleCtrl', ExampleCtrl);