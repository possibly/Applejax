// main file for NodeJS implementation
var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<html><head><title>Hi</title></head><body><b>Hi There?</b></body></html>");
  response.end();
}).listen(80);