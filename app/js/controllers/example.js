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

var currentPlayer = "malin";
var token;
//	localStorage.setItem("token", "1234567");
//	console.log(localStorage.getItem("token"));

/**
 * @ngInject
 */
function ExampleCtrl($window) {
	// Create one instance of our game
	var gameEngine = new GameEngine($window);

	body = {
		username: currentPlayer,
		password: "passw",
	};

	//login
	apigClient.loginPost(params, body, additionalParams)
	.then(function(result){
		token =  result.data.token;
		body = {
			token: token
		};
		//get user info
		apigClient.getUserPost(params, body, additionalParams)
		.then(function(result){
	        console.log(result.data);
	        gameEngine.player.score = result.data.score;

	        // Get objects and players in zone 0,0 
			//TODO: change to current zone
	        getItems([0,0,], gameEngine);
	    }).catch( function(result){
	        console.log(result);
	    });
    }).catch( function(result){
        console.log(result);
    });

	// Act on callback when Object is hit
	gameEngine.on('collision', function(object) {
		var newScore;
		console.log('Hit with object type ' + object.type, object);

		body = {
		 	obj_id: object.id,
		  	token: token
		};
		//update current zone in database
		apigClient.collisionPost(params, body, additionalParams)
		.then(function(result){
          	gameEngine.player.score = result.data;
          	console.log(result.data);
      	}).catch( function(result){
          	console.log(result);
      	});	
	});

	// Act on player moving into new sector
	gameEngine.on('sector', function(newSector) {
		console.log('Player just moved into sector', newSector);
		body = {
		  token: token,
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

//Retrieves objects and players from the specified zone
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
	  		if(currentObject.username !== currentPlayer){
      			gameEngine.addPlayer('generic', currentObject.username, currentObject.currentZone.x * 1920 + currentObject.position.x, currentObject.currentZone.y * 1080 + currentObject.position.y, currentObject.color);
      		}
      	}
      
      //console.log(result.data[0]);
  	}).catch( function(result){
      //This is where you would put an error callback
      console.log(result);
  	});
}