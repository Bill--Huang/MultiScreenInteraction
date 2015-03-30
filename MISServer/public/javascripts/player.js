/**
 * Created by huangzebiao on 15-3-20.
 */
jQuery(document).ready(function ($) {

    FastClick.attach(document.body);

	var StateString = {
		'-1': '点击屏幕，连接游戏',
		'0': '等待另一名玩家连接游戏',
		'1': '在倒数 10 秒中，点击屏幕，为汽车蓄能',
		'2': '游戏结束，刷新页面重新开始'
	};

	var waitTime = 10;
	var click = 0;
	var countTime = 0;
	var currentState = -2;

	ServiceBasic.init(OnConnection, OnGameStart, OnGameEnd, OnGameStateChange, OnError);


	$('body').click(function() {
		if(currentState == -2) {
			// no connection
			ServiceBasic.connect('player');
			currentState == -1;
		} else if(currentState == -1) {
			// wait

		} else if(currentState == 1) {
			// play
			click++;
			$('#result-text').text(click);
		} else if(currentState == 2) {
			// end
		}
	});


	function OnConnection(index) {
		if(index != null) {
			$('#player-index-text').text('玩家 ' + (index + 1));
		}
	}

	function OnError(message) {
		if(message) {
			$('#game-state-text').text(message);
		}
	}

	function OnGameStart() {

		console.log('On Game Start');

		var IntervalObject = setInterval(function(){
			if(countTime == waitTime) {
				//
				var data = {
					role: 'player',
					message: 'control_instruction',
					payload: {
						index: ServiceBasic.playerindex,
						click: click
					}
				};
				ServiceBasic.send(data);
				window.clearInterval(IntervalObject);

				currentState = 2;
				$('#countdown-text').text('');

			} else {
				countTime++;
				$('#countdown-text').text((waitTime - countTime) + ' s');
			}
		}, 1000);
	}

	function OnGameEnd(winIndex, selfIndex) {
		// reload page

		// show result
		if(winIndex == selfIndex) {
			// win
			$('#result-text').text('胜利');
		} else if(winIndex == -1) {
			$('#result-text').text('平局');
		} else {
			$('#result-text').text('失败');
		}
	}

	function OnGameStateChange(state) {
		//$('#game-status').text('Game State ' + state);
		$('#game-state-text').text(StateString[state]);
		currentState = state;
	}
});


//var socket = io.connect('localhost/player');
//
//socket.on('connect', function(){
//
//	var jsonObject = {
//    	'role': 'webPlayer',
//    	'data': {
//	        'message': 'register',
//	        'payload': '',
//	    },
//	};
//
//	sendToServer(jsonObject);
//	status_update('Connected to Server');
//});
//
//// socket = io.connect(null);
//// Main Event, all message send to it
//socket.on('WebDataEmitEvent', function(data){
//	message(data);
//	// alert(data);
//});
//
//// socket.on('message', function(data){
//// 	message(data);
//// });
//
//socket.on('disconnect', function(){
//	status_update('Disconnected from Server');
//});
//
//// function ConnectButtonEvent() {
//// 	// if(firstconnect) {
//
//// 		socket.on('connect', function(){
//// 			sendToServer('Message From Web Player');
//// 			status_update('Connected to Server');
//// 		});
//
//// 		// socket = io.connect(null);
//// 		// Main Event, all message send to it
//// 		socket.on('WebDataEmitEvent', function(data){
//// 			message(data);
//// 			// alert(data);
//// 		});
//
//// 		// socket.on('message', function(data){
//// 		// 	message(data);
//// 		// });
//
//// 		socket.on('disconnect', function(){
//// 			status_update('Disconnected from Server');
//// 		});
//// 		// socket.on('reconnect', function(){
//// 		// 	status_update('Reconnected to Server');
//// 		// });
//// 		// socket.on('reconnecting', function( nextRetry ){
//// 		// 	status_update('Reconnecting in ' + nextRetry + ' seconds');
//// 		// });
//// 		// socket.on('reconnect_failed', function(){
//// 		// 	message('Reconnect Failed');
//// 		// });
//// 	// 	firstconnect = false;
//// 	// } else {
//// 	// 	socket.socket.reconnect();
//// 	// }
//// }
//
//function disconnect() {
//	socket.disconnect();
//}
//
//function message(data) {
//	document.getElementById('message').innerHTML = 'Server says: ' + data;
//}
//
//function status_update(txt){
//	document.getElementById('status').innerHTML = txt;
//}
//
//function esc(msg){
//	return msg.replace(/</g, '<').replace(/>/g, '>');
//}
//
//function sendToServer(message) {
//	socket.emit('ServerDataEmitEvent', message);
//}