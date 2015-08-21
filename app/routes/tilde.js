//The home page. Perhaps this page is mostly instructions for the meatbrains to start playing?
//tilde is in reference of a common alias for a Unix home directory.

module.exports = function(req, res, params){
	res.write("<html>");
	res.write("Why, hello there meat brain!");
	res.write("<br><br>");
	res.write("<form action='/register/possibly/lethal' method='post'>");
	res.write("<input type='Submit' value='Register as a new user'>");
	res.write("</form>");
	res.write("</html>");
	res.end();
};
