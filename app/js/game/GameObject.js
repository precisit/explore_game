
var Sprite = require('./Sprite');

// Class for game objects, extends sprite

var GameObject = function(elem, x, y, vx, vy, id, type) {
	Sprite.apply(this, arguments);
	this.type = type;
};

GameObject.prototype = Sprite.prototype;
GameObject.prototype.constructor = GameObject;

module.exports = GameObject;