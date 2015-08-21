//Router helper functions.

var body = require('body/any');
var xtend = require('xtend');

//.post does some nice error checking.
//If you see a route url wrapped in a post
//function, then you know its a route
//for POST-only!
module.exports.post = function post (fn) {
	return function (req, res, params) {
		if (req.method !== 'POST') {
			res.statusCode = 400;
			res.end('not a POST\n');
		}
		body(req, res, function (err, pvars) {
			fn(req, res, xtend(pvars, params));
		});
	};
} //credit: https://github.com/substack/substack-flavored-webapp
