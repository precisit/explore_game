var apigClient = apigClientFactory.newClient({
    region: 'us-west-2'
});

var params = {};
var additionalParams = {};
var body = {};
var responsetimes = [];
var timestamps = [];
var total = 3;
var wait = 10000;
var current = total;

var callLambda = function(){
	if(current > 0){
		body = {
			time: Date.now()
		};

		apigClient.responsetimePost(params, body, additionalParams)
		.then(function(result){
				var now = Date.now();
				if(current != total){
					wait *= 2;
				}
				var respTime = now - result.data;
				responsetimes.push(respTime);
				var d = new Date(result.data);
				var time = d.toLocaleTimeString();
				
				time += " " + d.getMilliseconds();
				timestamps.push(time);
				current--;
				window.setTimeout(callLambda, wait);
		}).catch( function(result){
		        console.log("An error has occured. " +  total);
		});
	} else {
		var str = "";
		var str2 = "";
		for(var i = 0; i < total; i++){
			str += responsetimes[i] + "\n";
			str2 += timestamps[i] + "\n";
		}
		console.log(str);
		console.log(str2);
	}

};


callLambda();