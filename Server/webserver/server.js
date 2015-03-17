(function() {

	// 
	require("mootools");

	var http = require("http");
	var url = require("url");
	var fs = require("fs");

	var SocketManager = new(require("../lib/SocketManager/SocketManager"));

	var server;
	
	server = http.createServer(function(req, res){
	    
	    var path = url.parse(req.url).pathname;

		console.log("Request URL: " + req.url);

	    switch (path){
		    case "/":
		        res.writeHead(200, {"Content-Type": "text/html"});
		        res.write("<h1>Hello! Try the <a href='/index.html'>Socket.io Test</a></h1>");
		        res.end();
		        break;
		    case "/index.html":
		        fs.readFile(__dirname + path, function(err, data){
					console.log(__dirname + path);
			        if (err) {
						return Error404(res);
					}
			        res.writeHead(200, {"Content-Type": path == "json.js" ? "text/javascript" : "text/html"})
			        res.write(data, "utf8");
			        res.end();
		        });
		        break;
			case "/web.js":
		        fs.readFile(__dirname + path, function(err, data){
					console.log(__dirname + path);
			        if (err) {
						return Error404(res);
					}
			        res.writeHead(200, {"Content-Type": "text/javascript"})
			        res.write(data, "utf8");
			        res.end();
		        });
		        break;
		    default:
				// 404
				Error404(res);
	    }
	}).listen(1991);


	ConsoleLog("Server", "Create Server");

	var io = require("socket.io").listen(server);
	io.set('log level', 1);
	io.sockets.on("connection", function(socket){
		
		// Basic Event for Receiving Message from App / Web
	    socket.on("ServerDataEmitEvent", function(message){
	        EventHandler(socket, message);
	    });
		
		// 
	    socket.on("disconnect", function(){
	        ConsoleLog("Server", "Connection " + socket.id + " terminated.");
	    });
	});

	function EventHandler(socket, message) {
		//
		if(message != null) {
			SocketManager.processSocketMessage(socket, message);
		}
	}

	function ConsoleLog(sender, message) {
		console.log("\n [" + sender + " Log] ->");
		console.log(message);
	}

	function Error404 (res) {
		res.writeHead(404);
		res.write("404");
		res.end();
	}
}).call(this);