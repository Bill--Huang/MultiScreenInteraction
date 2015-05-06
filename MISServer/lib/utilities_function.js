/**
 * Created by huangzebiao on 15-3-20.
 */

/*
 * Console.log formate
 */
exports.cl = function(from, message, suffix) {
    console.log('\n[' + from + ' Log] ->');
    if(suffix != undefined || suffix != null || suffix != '') {

    } else {
        suffix = '';
    }
    console.log('Log: ' + message + suffix + '\n');
}