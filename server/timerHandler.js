var timer_module = require('timer-stopwatch')

module.exports = {
	
	getTimer: function(time, refreshRate, timeCallback, doneCallback) {
		var options = {
			"refreshRateMS": refreshRate
		}
		var timer = new timer_module(time, options);
	
		timer.on('time', timeCallback);
		timer.on('done', function(){
			doneCallback()
		});
	
		return timer
    }
}