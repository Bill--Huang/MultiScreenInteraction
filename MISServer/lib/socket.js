/**
 * Created by huangzebiao on 15-3-20.
 */

module.exports = {
    SocketIO : null,
    sio : null,
    socketManager: null,
    utilities: null,

    listen: function(server) {

        var self = this;

        self.utilities = require('./utilities_function');
        self.socketManager = require('./socket_manager');

        // Bug: if call this function, socketManager can not be call normally
        // Fix: if self is global, it will pollute context, including socketManger(it has self also)
        self.socketManager.init();

        self.SocketIO = require("socket.io");
        self.sio = self.SocketIO.listen(server);
        self.sio.set('log level', 1);

        /*
         * Socket Route
         */
        // for player
        self.sio.of('/player').on('connection', function(socket){
            self.socketManager.addPlayerSocket(socket);
        });

        // for app game
        self.sio.of('/appgame').on('connection', function(socket){
            self.socketManager.addAppSocket(socket);
        });

        self.utilities.cl('Server', 'Init SocketIO');
    },

};







