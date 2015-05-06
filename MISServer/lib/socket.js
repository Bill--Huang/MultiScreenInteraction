/**
 * Created by huangzebiao on 15-3-20.
 */

module.exports = {
    SocketIO : null,
    sio : null,
    socketManager: null,
    utilities: null,
    uuidGenerator: null,
    socketManagersArray: {},

    listen: function(server) {

        var self = this;
        var url = require('url');

        self.utilities = require('./utilities_function');
        self.uuidGenerator = require('node-uuid');
        //self.socketManager = require('./socket_manager');

        // Bug: if call this function, socketManager can not be call normally
        // Fix: if self is global, it will pollute context, including socketManger(it has self also)
        //self.socketManager.init();

        self.SocketIO = require("socket.io");
        self.sio = self.SocketIO.listen(server);
        self.sio.set('log level', 1);

        self.socketManager = require('./socket_manager');

        /*
         * Socket Route:
         * generate "room" in appgame by using unique uuid, send uuid back to appgame page to generate qrcode
         * when scan qrcode, will go to player page, and send uuid to server
         * then, connect appgame socket to player socket by uuid
         */
        // for app game
        self.sio.of('/appgame').on('connection', function(socket) {

            var tempSocketManager = self.socketManager.sm();
            tempSocketManager.init(self, self.uuidGenerator.v1());
            tempSocketManager.addAppSocket(socket);

            self.socketManagersArray[tempSocketManager.uuid] = tempSocketManager;
        });

        // for player
        self.sio.of('/player').on('connection', function(socket){

            // get uuid
            var query = url.parse(socket.handshake.headers.referer, true).query;

            // if contain uuid
            var uuid = query.uuid;
            if(self.contain(uuid)) {
                self.socketManagersArray[uuid].addPlayerSocket(socket);
            } else {
                var resJson = {
                    message: 'link_outdated',
                    payload: {
                    }
                };
                self.utilities.cl('Server', 'uuid is outdated');
                socket.emit('error', resJson);
            }
        });

        self.utilities.cl('Server', 'Init SocketIO');
    },

    remove: function(id) {
        var self = this;
        delete self.socketManagersArray[id];

        self.utilities.cl('Server', 'App Socket is deleted', " ##### uuid:" + id)
    },

    contain: function(id) {

        // check if socketManagersArray contains id
        var self = this;

        // 1
        //var isContained = false;
        //for(var key in self.socketManagersArray) {
        //    console.log(key + ": " + self.socketManagersArray[key]);
        //    if(id == self.socketManagersArray[key]) {
        //        isContained = true;
        //        break;
        //    }
        //}
        //
        //return isContained;

        // 2
        return self.socketManagersArray[id] !== undefined;
    }

};







