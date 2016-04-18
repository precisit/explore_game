'use strict';

var events = require('events');
var d3 = require('d3');

// Game dependencies
var GameObject = require('./GameObject');
var Camera = require('./Camera');
var Player = require('./Player');


var Game = function(window) {
	console.log('Gamepads', navigator.getGamepads());

	this.window = window;
	this.view = d3.select('svg#view');
	this.viewEl = this.view[0][0];
	this.mainLayer = this.view.append('g');
	this.mainLayerEl = this.mainLayer[0][0];

	// Track for presice dT calculation
	this.lastFrameTime = this.window.performance.now();

	// Player w. bounding box (TODO: Add bounding box to player class inheriting from Sprite?)
	this.player = new Player(this.view.insert('circle').attr('cx',10).attr('cy',10).attr('r', 10), 960, 540, 0, 0);
	this.playerBBox = this.viewEl.createSVGRect();
	this.playerBBox.width = this.playerBBox.height = 20;

	// Camera for tracking player movements in view
	this.camera = new Camera(this.view, this.player);

	// Objects in game 
	this.objectArr = [];
	this.objectMap = {};
	this.objectArr.push(this.player);
};

Game.prototype.__proto__ = events.EventEmitter.prototype; // Enable Game to emit events

// External method to add objects to game
Game.prototype.addGenericObject = function(type, objId, x, y, color) {
	// TODO: Different style of item depending on type (SVG icon?)
	var object = new GameObject(this.mainLayer.insert('rect')
		.attr('height', 30)
		.attr('width', 30)
		.attr('fill', color)
		.attr('id', objId),
		x, y, 0, 0, objId, type);
	this.objectArr.push(object);
	this.objectMap[objId] = object;
	object.update(0);
	return object;
};

Game.prototype.addPlayer = function(type, objId, x, y, color) {
	// TODO: Different style of item depending on type (SVG icon?)
	var object = new GameObject(this.mainLayer.insert('circle')
		.attr('cx',10)
		.attr('cy',10)
		.attr('r', 10)
		.attr('fill', color)
		.attr('id', objId),
		x, y, 0, 0, objId, type);
	this.objectArr.push(object);
	this.objectMap[objId] = object;
	object.update(0);
	return object;
};

Game.prototype.loop = function() {
	this.window.requestAnimationFrame(this.loop.bind(this));

	// Track timing of game
	var curFrameTime = this.window.performance.now();
	var dT = (curFrameTime - this.lastFrameTime) / 1000.0;
	this.lastFrameTime = curFrameTime;


	// Get gamePad input and update player velocity - TODO: Add hotset w. multiple game-pads (Low prio)
	try {
		var gamePad = navigator.getGamepads()[0];
		var vel = [
			Math.abs(gamePad.axes[2]) < 0.15 ? 0 : gamePad.axes[2]*500, 
			Math.abs(gamePad.axes[3]) < 0.15 ? 0 : gamePad.axes[3]*500
		];
		this.player.setVel(vel);		
	}
	catch (e) {
		console.error('No gamepad found! Connect one and press a button.');
	}


	// Update all sprites
	this.objectArr.forEach(function(object) {
		if(object.removeFlag) {
			// TODO: Clean out objectArr and objectMap from unused objects
		}
		else {
			object.update(dT);
		}
	});


	// Check & trigger for new area on map
	var newSector = this.player.checkSector();
	if(newSector) { this.emit('sector', newSector); }


	// Check for collisions
	var bBox = this.player.elemEl.getBoundingClientRect();
	var viewElBox = this.viewEl.getBoundingClientRect(); // Game window can be resized between frames.
	this.playerBBox.x = bBox.left - viewElBox.left;
	this.playerBBox.y = bBox.top - viewElBox.top;
	this.playerBBox.width = bBox.width;
	this.playerBBox.height = bBox.height; 
	var hitList = this.viewEl.getIntersectionList(this.playerBBox, this.mainLayerEl);
	for (var i = 0; i < hitList.length; i++) {
		if(hitList[i] !== this.player.elem[0][0] && hitList[i].id && this.objectMap[hitList[i].id]) {
			this.emit('collision', this.objectMap[hitList[i].id]); // Emit collision event with game-object that was hit
			this.objectMap[hitList[i].id].remove();
		}
	}


	// Update camera
	this.camera.update(dT);
};

module.exports = Game;


