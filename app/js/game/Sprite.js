
// Class for sprites or objects
// Position and Velocity as well as link to DOM

var Sprite = function(elem, x, y, vx, vy, id) {
	this.elem = elem;
	this.pos = [x || 0, y || 0];
	this.oldPos = [x || 0, y || 0];
	this.vel = [vx || 0, vy || 0];
	this.id = id;
	this.removeFlag = false;
};

Sprite.prototype.setVel = function(vel) {
	this.vel = [vel[0] || 0, vel[1] || 0]
}

Sprite.prototype.update = function(dT) {
	for (var index in [0, 1]) {
		this.oldPos[index] = this.pos[index];
		this.pos[index] += this.vel[index]*dT;
	}

	this.elem.attr('transform', 'translate('+this.pos.join(',')+')');
}

Sprite.prototype.undoUpdate = function() {
	for (var index in [0, 1]) {
		this.pos[index] = this.oldPos[index];
	}

	this.elem.attr('transform', 'translate('+this.pos.join(',')+')');
}

Sprite.prototype.remove = function() {
	this.elem.remove();
	this.removeFlag = true; // Mark for removal
}

module.exports = Sprite;