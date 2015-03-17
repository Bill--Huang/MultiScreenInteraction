// null means localhost
var socket = io.connect(null);

socket.on('connect', function(){ 	

	var jsonObject = {
    	"role": "webPlayer",
    	"data": {
	        "message": "register",
	        "payload": "",
	    },
	};	

	sendToServer(jsonObject);
	status_update("Connected to Server"); 
});

// socket = io.connect(null);
// Main Event, all message send to it
socket.on('WebDataEmitEvent', function(data){
	message(data); 
	// alert(data);
});

// socket.on('message', function(data){ 
// 	message(data); 
// });

socket.on('disconnect', function(){ 
	status_update("Disconnected from Server"); 
});

// function ConnectButtonEvent() {
// 	// if(firstconnect) {

// 		socket.on('connect', function(){ 	
// 			sendToServer("Message From Web Player");
// 			status_update("Connected to Server"); 
// 		});
		
// 		// socket = io.connect(null);
// 		// Main Event, all message send to it
// 		socket.on('WebDataEmitEvent', function(data){ 
// 			message(data); 
// 			// alert(data);
// 		});

// 		// socket.on('message', function(data){ 
// 		// 	message(data); 
// 		// });
		
// 		socket.on('disconnect', function(){ 
// 			status_update("Disconnected from Server"); 
// 		});
// 		// socket.on('reconnect', function(){ 
// 		// 	status_update("Reconnected to Server"); 
// 		// });
// 		// socket.on('reconnecting', function( nextRetry ){ 
// 		// 	status_update("Reconnecting in " + nextRetry + " seconds"); 
// 		// });
// 		// socket.on('reconnect_failed', function(){ 
// 		// 	message("Reconnect Failed"); 
// 		// });
// 	// 	firstconnect = false;
// 	// } else {
// 	// 	socket.socket.reconnect();
// 	// }
// }

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

function sendToServer(message) {
	socket.emit("ServerDataEmitEvent", message);
}