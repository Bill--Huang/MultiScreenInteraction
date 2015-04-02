/**
 * Created by huangzebiao on 15-3-20.
 */
jQuery(document).ready(function ($) {


    FastClick.attach(document.body);

	var StateString = {
		'-1': '点击屏幕，连接游戏',
		'0': '等待另一名玩家连接游戏',
		'1': '',
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
			// do not show click num
            // play click animation


            if(click % 2 == 0) {
                $('#engine-container img').attr('src', 'images/engine-1.png');
            } else {
                $('#engine-container img').attr('src', 'images/engine-2.png');
            }

			// $('#result-text').text(click);
		} else if(currentState == 2) {
                // end
            }
	});


	function OnConnection(index) {
		if(index != null) {
			$('#player-index-text').text('' + (index + 1));
            $('#player-text').text('玩家');

		}
	}

	function OnError(message) {
		if(message) {
			$('#game-state-text').text(message);
		}
	}

	function OnGameStart() {

		console.log('On Game Start');

        // change bg color
        $('#main-container-bg').addClass('start-bg');

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
				$('#countdown-text').text('汽车冲刺中');

			} else {
				countTime++;
				$('#countdown-text').text((waitTime - countTime) + ' s');
			}
		}, 1000);
	}

	function OnGameEnd(winIndex, selfIndex) {

        //
        $('#main-container-bg').removeClass('start-bg');
        $('#countdown-text').text('');

        // show result
        var resultImg = 'images/win.png';

        if (winIndex == -1) {
            // tie
            resultImg = 'images/tie.png';
        } else if( winIndex != selfIndex) {
            // lose
            resultImg = 'images/lose.png';
        }

        $('#result-container img').attr('src', resultImg);

        $('#result-container').css('display', 'block');
        $('#engine-container').css('display', 'none');
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