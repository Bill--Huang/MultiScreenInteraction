/**
 * Created by huangzebiao on 15-3-20.
 */
jQuery(document).ready(function ($) {

    CanvasDrawer.init();
    //CanvasDrawer.config(20, 50, null);
    //CanvasDrawer.draw();

    //CanvasDrawer.draw();
    //CanvasDrawer.config(1, 10);
    //CanvasDrawer.draw();

    ServiceBasic.init(OnConnection, OnGameStart, OnGameEnd, OnGameStateChange, OnError);
    ServiceBasic.connect('appgame');
    function OnConnection(uuid) {
        console.log('On Game Connection');
        // generate qrcode
        console.log(uuid);


        var playerLink = "http://" + document.domain + ":3330/player?uuid=" + uuid;
        console.log(playerLink);
        $('#qrcode-container').qrcode(
            {
                width: 100,
                height: 100,
                text: playerLink
            }
        );
    }

    function OnError(message) {

    }

    function OnGameStart() {
        console.log('On Game Start');
        $('#text-container').css('display', 'block');
        $('#text-img').attr('src', 'images/start.png');
    }

    function OnGameEnd(instructionsFromPlayer, winIndex, afterAnimationCallback) {

        // update UI
        for(var i = 0; i < 2; i++) {
            var idname = '#messageBox' + i;
            $(idname).text('Message From Player ' + i + ' :  ' + instructionsFromPlayer[i] + ' clicks');
        }
        console.log('Winner is ' + winIndex);

        var offset = instructionsFromPlayer[0] - instructionsFromPlayer[1];

        if(offset > 7) {
            instructionsFromPlayer[0] = instructionsFromPlayer[1] + (Math.random() * 5);
        } else if(offset < -7) {
            instructionsFromPlayer[1] = instructionsFromPlayer[0] + (Math.random() * 5);
        }

        CanvasDrawer.config(instructionsFromPlayer[0], instructionsFromPlayer[1], function(){
            //CanvasDrawer.stopDraw();
            var p1s = Math.round(instructionsFromPlayer[0] * 1.7);
            var p2s = Math.round(instructionsFromPlayer[1] * 1.7);
            afterAnimationCallback(p1s, p2s);

            // show distance text
            $('#text-container').css('display', 'block');
            $('#text-img').attr('src', 'images/distance.png');
            $('#p1-score').text(p1s);
            $('#p2-score').text(p2s);
            $('#distance-container').css('display','block');

            // 3s later, show end game
            // 3s later show wait game
            setTimeout(function(){
                $('#text-container').css('display', 'block');
                $('#text-img').attr('src', 'images/end.png');
                setTimeout(function(){
                    $('#text-container').css('display', 'block');
                    $('#text-img').attr('src', 'images/wait.png');
                    // reset canvas
                    CanvasDrawer.reset();
                    $('#p1-score').text('');
                    $('#p2-score').text('');
                    $('#distance-container').css('display','none');
                }, 4000);
            }, 4000);

        });
        CanvasDrawer.draw();

        $('#text-container').css('display', 'none');
        //$('#text-img').attr('src', '');
    }

    function OnGameStateChange(state) {
        $('#game-status').text('Game State ' + state);
    }
});
//
//function disconnect() {
//    socket.disconnect();
//}
//
//function message(data) {
//    document.getElementById('message').innerHTML = 'Server says: ' + data;
//}
//
//function status_update(txt){
//    document.getElementById('status').innerHTML = txt;
//}
//
//function esc(msg){
//    return msg.replace(/</g, '<').replace(/>/g, '>');
//}
