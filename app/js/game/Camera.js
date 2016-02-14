// Camera class for handling translation of camera + UI text (score, inventory, etc)

var LIMIT = 260; // Buffer to edge to trigger camera move

var Camera = function(view, player) {
	this.view = view;
	this.viewEl = view[0][0];

	this.halfSize = [this.viewEl.viewBox.baseVal.width/2,this.viewEl.viewBox.baseVal.height/2];
	this.viewOrg = [this.halfSize[0],this.halfSize[1]];
	this.player = player;

	// Track for FPS (% 30 on frameCount and update FPS in UI)
	this.frameCount = 0;
	this.fpsTime = 0;
	this.fps = 0;

	// Set up game UI
	this.ui = this.view.append('g'); // NOTE: Must be added after other groups to be on top 
	this.scoreText = this.ui.append('text').attr('x', 10).attr('y', 30).attr('class', 'score');
	this.fpsText = this.ui.append('text').attr('x', 2*this.halfSize[0]-10).attr('y', 2*this.halfSize[1]-10).attr('class', 'fps');
}

Camera.prototype.update = function(dT) {
	this.frameCount += 1;

	// Calculate camera delta movement to follow player - TODO: Optimize !
	for (var i in [0, 1]) {
		var diff = this.halfSize[i]-LIMIT-Math.abs(this.player.pos[i] - this.viewOrg[i]);
		if(diff < 0) {
			this.viewOrg[i] = this.viewOrg[i] + (this.player.pos[i] < this.viewOrg[i] ? 1 : -1) * diff;
		}
	}
	var cameraPos = [this.viewOrg[0] - this.halfSize[0], this.viewOrg[1] - this.halfSize[1]];

	// Set view to new camera pos
	this.viewEl.viewBox.baseVal.x = cameraPos[0];
	this.viewEl.viewBox.baseVal.y = cameraPos[1];

	// Translate UI to be static
	this.ui.attr('transform', 'translate('+cameraPos.join(',')+')');

	// Update FPS
	this.fpsTime += dT;
	if(this.frameCount % 20 == 0) { // Update FPS every 0.33 sec
		this.fps = Math.round(20/this.fpsTime);
		this.fpsTime = 0;
	}

	// Update text & icons in UI
	this.scoreText.text(this.player.score);
	this.fpsText.text(this.fps);
}

module.exports = Camera;