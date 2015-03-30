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
    function OnConnection() {

    }

    function OnError(message) {

    }

    function OnGameStart() {
        console.log('On Game Start');
    }

    function OnGameEnd(instructionsFromPlayer, winIndex, afterAnimationCallback) {

        // update UI
        for(var i = 0; i < 2; i++) {
            var idname = '#messageBox' + i;
            $(idname).text('Message From Player ' + i + ' :  ' + instructionsFromPlayer[i] + ' clicks');
        }
        console.log('Winner is ' + winIndex);

        CanvasDrawer.config(instructionsFromPlayer[0], instructionsFromPlayer[1], function(){
            //CanvasDrawer.stopDraw();
            afterAnimationCallback();
        });
        CanvasDrawer.draw();
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
