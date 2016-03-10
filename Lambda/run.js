var lambda = require('./game.js');

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

lambda.randomScore({}, context);