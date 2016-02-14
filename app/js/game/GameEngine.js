
var d3 = require('d3');

// Game dependencies
var Sprite = require('./Sprite');

var Game = function(window) {
	console.log('Game Engine Created !');

	this.view = d3.select('svg#view');
	this.window = window;
	this.frameCount = 0;
	this.viewBox = [0,0,1920,1080];

	this.lastFrameTime = this.window.performance.now();

	this.player = new Sprite(this.view.insert('circle').attr('r', 10), 960, 540, 0, 0);

	console.log('Gamepads', navigator.getGamepads());

};

Game.prototype.loop = function() {
	this.frameCount += 1;
	var curFrameTime = this.window.performance.now();
	var dT = (curFrameTime - this.lastFrameTime) / 1000.0;

	var gamePad = navigator.getGamepads()[0]

	//this.viewBox[0] -= gamePad.axes[0]*10;
	//this.viewBox[1] -= gamePad.axes[1]*10;

	var vel = [
		Math.abs(gamePad.axes[2]) < 0.5 ? 0 : gamePad.axes[2] * 500, 
		Math.abs(gamePad.axes[3]) < 0.5 ? 0 : gamePad.axes[3]*500
	]
	this.player.setVel(vel);
	this.player.update(dT);

	// Calculate origin
	var orgX = this.viewBox[0] + 960;
	var orgY = this.viewBox[1] + 540;

	// Calculate camera delta movement to follow player 
	var LIMIT = 260;
	var diffX = 960-LIMIT-Math.abs(this.player.pos[0] - orgX);
	if(diffX < 0) {
		if(this.player.pos[0] < orgX) { this.viewBox[0] += diffX; }
		if(this.player.pos[0] > orgX) { this.viewBox[0] -= diffX; }
	}
	var diffY = 540-LIMIT-Math.abs(this.player.pos[1] - orgY);
	if(diffY < 0) {
		if(this.player.pos[1] < orgY) { this.viewBox[1] += diffY; }
		if(this.player.pos[1] > orgY) { this.viewBox[1] -= diffY; }
	}


	// Update viewBox for view
	//this.view.attr('viewBox', this.viewBox.join(' '));
	//this.obj.attr('transform', 'translate('+this.pos.join(',')+')');
	//this.obj.attr('x', this.pos[0]).attr('y', this.pos[1]);

	//BEST OPTION not visible in DOM 
	this.view[0][0].viewBox.baseVal.x = this.viewBox[0];
	this.view[0][0].viewBox.baseVal.y = this.viewBox[1];
	
	this.lastFrameTime = curFrameTime;
	this.window.requestAnimationFrame(this.loop.bind(this));
}

module.exports = Game;
