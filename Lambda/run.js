var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

var lambda = require('./game.js');
var enter = require('./enterZone.js');

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

//lambda.randomScore({}, context);

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


enter.getPlayers(params, context);
