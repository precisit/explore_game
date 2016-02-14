'use strict';

var controllersModule = require('./_index');
var d3 = require('d3');

var GameEngine = require('../game/GameEngine');

/**
 * @ngInject
 */
function ExampleCtrl($window) {

	console.log(d3);

	var gameEngine = new GameEngine($window);

	gameEngine.loop();
}

controllersModule.controller('ExampleCtrl', ExampleCtrl);