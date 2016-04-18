var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

var enter = require('./enterZone.js');
var collision = require ('./collision.js');

AWS.config.region = 'us-west-2';

var context = {
	done: function(err, data) {
		if(err){
			console.log(err, err.stack);
		} else {
			console.log(data);
		}
	},
	fail: function(data){
		console.error(data);
	}
};


var params = {
	currentZone : {
		x: 0,
		y: 0
	},
	objects : ["first", "second"],
	id: "1337"

};
//enter.saveCurrentZone(params, context);

//enter.getObjects(params, context);


//enter.getPlayers(params, context);

params = {
	obj_id: "6e817028-0f15-41e4-90d7-46f3f7ed6522",
	user_id: "1ef0f041-c671-4615-9546-354c7ca1d4c0"
};

collision.objectCollision(params, context);