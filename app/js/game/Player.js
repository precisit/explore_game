
var Sprite = require('./Sprite');

// Class for player objects, extends sprite

var Player = function(elem, x, y, vx, vy, id) {
	Sprite.apply(this, arguments);
	this.name = ''; // Change from outside to update player name
	this.score = 0;
};

Player.prototype = Sprite.prototype;
Player.prototype.constructor = Player;

module.exports = Player;