
// Class for sprites or objects
// Position and Velocity as well as link to DOM

var Sprite = function(elem, x, y, vx, vy) {
	this.elem = elem;
	this.pos = [x || 0, y || 0];
	this.vel = [vx || 0, vy || 0];
};

Sprite.prototype.setVel = function(vel) {
	this.vel = [vel[0] || 0, vel[1] || 0]
}

Sprite.prototype.update = function(dT) {
	for (var index in [0, 1]) {
		this.pos[index] += this.vel[index]*dT;
	}

	this.elem.attr('transform', 'translate('+this.pos.join(',')+')');
}

module.exports = Sprite;