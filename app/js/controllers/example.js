'use strict';

var controllersModule = require('./_index');
var d3 = require('d3');
var uuid = require('uuid');

var GameEngine = require('../game/GameEngine');

var apigClient = apigClientFactory.newClient({
    region: 'us-west-2'
});

var params = {};
var additionalParams = {};
var body = {};

var currentPlayer = "1ef0f041-c671-4615-9546-354c7ca1d4c0";

/**
 * @ngInject
 */
function ExampleCtrl($window) {

	//console.log(d3);

	// Create one instance of our game
	var gameEngine = new GameEngine($window);

	// Get objects and players in zone 0,0 
	//TODO: retrieve current zone
	//TODO: retrieve current points


	getItems([0,0,], gameEngine);

	// Act on callback when Object is hit
	gameEngine.on('collision', function(object) {
		var newScore;
		console.log('Hit with object type ' + object.type, object);

		body = {
		  obj_id: object.id,
		  user_id: currentPlayer
		};
		//update current zone in database
		apigClient.collisionPost(params, body, additionalParams)
		.then(function(result){
          //This is where you would put a success callback
          gameEngine.player.score = result.data;
          console.log(result.data);
      	}).catch( function(result){
          //This is where you would put an error callback
          console.log(result);
      	});	
	});

	// Act on player moving into new sector
	gameEngine.on('sector', function(newSector) {
		console.log('Player just moved into sector', newSector); // TODO: Get sector data from lambda + populate objects, etc as needed.
		body = {
		  id: currentPlayer,
		  currentZone: {
		    x: newSector[0],
		    y: newSector[1]
		  }
		};
		//update current zone in database
		apigClient.updateZonePost(params, body, additionalParams)
		.then(function(result){
          //This is where you would put a success callback
          console.log(result.data);
      	}).catch( function(result){
          //This is where you would put an error callback
          console.log(result);
      	});

      	getItems(newSector, gameEngine)

	});

	// Start the game loop
	gameEngine.loop();
}

controllersModule.controller('ExampleCtrl', ExampleCtrl);


function getItems(zone, gameEngine){
	body = {
	  currentZone: {
	    x: zone[0],
	    y: zone[1]
	  }
	};

	apigClient.retriveObjectsPost(params, body, additionalParams)
	.then(function(result){
	  //Add objects to game
      for (var i = 0; i < result.data.length; i++){
      	var currentObject = result.data[i];
      	gameEngine.addGenericObject('generic', currentObject.id, currentObject.zone.x * 1920 + currentObject.position.x, currentObject.zone.y * 1080 + currentObject.position.y, currentObject.color);
      }
      //if no objects in zone, create 10 new
      /*if(result.data.length === 0){
      	console.log("none");
		apigClient.addObjectsPost(params, body, additionalParams)
		.then(function(result){
			console.log(result);
	         //retrieve new objects from database
	     	 apigClient.retriveObjectsPost(params, body, additionalParams)
			.then(function(result){
		      //add objects to game
		      for (var i = 0; i < result.data.length; i++){
		      	var currentObject = result.data[i];
		      	gameEngine.addGenericObject('generic', currentObject.id, currentObject.zone.x * 1920 + currentObject.position.x, currentObject.zone.y * 1080 + currentObject.position.y, currentObject.color);
		      }
		  	}).catch( function(result){
		      console.log(result);
		  	});
	  	}).catch( function(result){
	      console.log(result);
	  	});
	  }*/
  	}).catch( function(result){
      console.log("Error: " + result);
  	});

	apigClient.retrievePlayersPost(params, body, additionalParams)
	.then(function(result){
		console.log(result.data);
	  	for (var i = 0; i < result.data.length; i++){
	  		var currentObject = result.data[i];
	  		//remove current player from result
	  		if(currentObject.id !== currentPlayer){
      			gameEngine.addPlayer('generic', currentObject.id, currentObject.currentZone.x * 1920 + currentObject.position.x, currentObject.currentZone.y * 1080 + currentObject.position.y, currentObject.color);
      		}
      	}
      
      //console.log(result.data[0]);
  	}).catch( function(result){
      //This is where you would put an error callback
      console.log(result);
  	});
}