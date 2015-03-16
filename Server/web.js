var socket;

var firstconnect = true;

function connect() {
	if(firstconnect) {
		socket = io.connect("192.168.1.107:1991");

		socket.on('WebDataEmitEvent', function(data){ 
			message(data); 
			// alert(data);
		});

		socket.on('message', function(data){ 
			message(data); 
		});
		socket.on('connect', function(){ 
			
			socket.emit("ServerDataEmitEvent", "Web Message");

			status_update("Connected to Server"); 
		});
		socket.on('disconnect', function(){ 
			status_update("Disconnected from Server"); 
		});
		socket.on('reconnect', function(){ 
			status_update("Reconnected to Server"); 
		});
		socket.on('reconnecting', function( nextRetry ){ 
			status_update("Reconnecting in " + nextRetry + " seconds"); 
		});
		socket.on('reconnect_failed', function(){ 
			message("Reconnect Failed"); 
		});
		firstconnect = false;
	} else {
		socket.socket.reconnect();
	}
}

function disconnect() {
	socket.disconnect();
}

function message(data) {
	document.getElementById('message').innerHTML = "Server says: " + data;
}

function status_update(txt){
	document.getElementById('status').innerHTML = txt;
}

function esc(msg){
	return msg.replace(/</g, '<').replace(/>/g, '>');
}

function send() {
	socket.emit("ServerDataEmitEvent", "Web Message");
}