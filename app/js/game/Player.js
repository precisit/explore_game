'use strict';
var Sprite = require('./Sprite');

// Class for player objects, extends sprite

var Player = function(elem, x, y, vx, vy, id) {
	Sprite.apply(this, arguments);
	this.name = ''; // Change from outside to update player name
	this.score = 0;

	this.sector = [0,0];
	this.gameArea = [1920,1080]; // Static const - TODO: Move out to separate consts file
};

Player.prototype.__proto__ = Sprite.prototype; 
Player.prototype.constructor = Player;

Player.prototype.checkSector = function() {
	var newSector = [];
	for(var i in [0,1]) {
		newSector[i] = Math.floor(this.pos[i] / this.gameArea[i]);
	}

	if(newSector[0] !== this.sector[0] || newSector[1] !== this.sector[1]) {
		this.sector = newSector;
		return newSector;
	}

	return;
};

module.exports = Player;