var fs = require('fs')
module.exports = {
	get: function(param) {
		var configs = JSON.parse(configFileContents())
		return eval("configs."+param)
	}
}

var configFileContents = function() {
	return fs.readFileSync(__dirname+"/configs.json")
}