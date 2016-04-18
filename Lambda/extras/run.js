var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

var add = require('./add.js');

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



var newPlayer = {
	name: "malin",
	currentZone: {
		x: 0,
		y: 0
	},
	position: {
		x: 960,
		y: 540
	},
	color: '#3366cc' 
};

add.addPlayer(newPlayer, context);

var newObject = {
	zone: {
		x: 0,
		y: 0
	}
}

//add.addObjects(newObject, context);
//add.addObject(newObject, context);