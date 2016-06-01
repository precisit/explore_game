var apigClient = apigClientFactory.newClient({
    region: 'us-west-2'
});

var params = {};
var additionalParams = {};
var body = {};
var responsetimes = [];
var timestamps = [];

var callLambda = function(current, total){
	if(current > 0){
		body = {
			time: Date.now()
		};

		apigClient.responsetimePost(params, body, additionalParams)
		.then(function(result){
				var now = Date.now();
				var respTime = now - result.data;
				timestamps.push(result.data);
				responsetimes.push(respTime);
		        callLambda(current - 1, total);
		}).catch( function(result){
		        console.log("An error has occured. " +  total);
		        timestamps.push(body.time);
				responsetimes.push("Error");
		        callLambda(current - 1, total);
		});
	} else {
		var str = "";
		for(var i = 0; i < total; i++){
			str += responsetimes[i] + "\n";
		}
		console.log(str);
	}

};
var tests = 10;
callLambda(tests, tests);
