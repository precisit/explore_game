var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

var enter = require('./enterZone.js');
var collision = require ('./collision.js');
var login = require ('./login.js');

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
	username: "malin"

};
//enter.saveCurrentZone(params, context);

//enter.getObjects(params, context);


//enter.getPlayers(params, context);

params = {
	obj_id: "6e817028-0f15-41e4-90d7-46f3f7ed6522",
	username: "malin"
};

//collision.objectCollision(params, context);


params = {
	username: 'malin',
	password: 'passw'
}

//login.login(params, context);

params = {
	token: 'eyJ1c2VybmFtZSI6Im1hbGluIiwidmFsaWRUbyI6MTQ2MTIzOTE4ODU0N30=:c+LYqIO+By6pqOKbwPx66tvUHSYsaDjEN9i8guAYL4o=',
	expiresIn: 3600
}
//login.get(params, context);


/*
var hashAuthToken = require('hash-auth-token')('super-secret-random-string');
var token = hashAuthToken.generate({username: 'hello'}, 3600);
var userObj = hashAuthToken.verify(token);
console.log(userObj);
*/