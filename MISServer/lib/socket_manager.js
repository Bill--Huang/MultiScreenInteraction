/**
 * Created by huangzebiao on 15-3-20.
 */

/*
 * Class that manage all sockets come from 'appgame' and 'player' page
 * and maintain game logic
 */
module.exports.sm = function() {
    return {
        appSocket: null,
        playerSockets: {},
        playerNumLimitation: 2,
        self: null,
        utilities: null,
        AppGameDataEmitEvent: 'AppGameDataEmitEvent',
        PlayerDataEmitEvent: 'PlayerDataEmitEvent',
        ServerDataEmitEvent: 'ServerDataEmitEvent',

        uuid: -1,

        init: function () {
            var self = this;

            self.playerSockets[0] = null;
            self.playerSockets[1] = null;

            //console.log(self);

            self.utilities = require('./utilities_function');
            self.utilities.cl('Server', 'New A Sockets Manager Room', " ##### uuid:" + self.uuid);

            //console.log(self.uuid);
        },

        /*
         * polluted again
         */
        process: function (data) {
            ////
            ////var self = this;
            ////console.log(data);
            //if(data) {
            //    var role = data['role'];
            //    var message = data['message'];
            //    var payload = data['payload'];
            //
            //    if(role == 'appgame') {
            //
            //    } else if(role == 'player') {
            //        //
            //        switch (message) {
            //            case 'control_instruction':
            //                var tst = {
            //                    role: role,
            //                    message: message,
            //                    payload: payload
            //                };
            //                //console.log(tst);
            //
            //                //console.log(self);
            //
            //                send(appSocket, AppGameDataEmitEvent, data);
            //                break;
            //        }
            //    }
            //}
        },

        addAppSocket: function (socket) {
            var self = this;

            if (!self.appSocket) {
                //self.utilities.cl('Server', 'App connect');
                self.appSocket = socket;

                socket.on("disconnect", function () {
                    self.removeAppSocket(socket);
                });

                // Main logic event
                //socket.on(self.ServerDataEmitEvent, self.process);

                socket.on(self.ServerDataEmitEvent, function (data) {
                    //
                    //var self = this;
                    //console.log(data);
                    if (data) {
                        var role = data['role'];
                        var message = data['message'];
                        var payload = data['payload'];

                        if (role == 'appgame') {
                            switch (message) {
                                case 'gameend_request':
                                    //self.send(self.appSocket, self.AppGameDataEmitEvent, data);
                                    self.utilities.cl('Server', 'Get End Request From Server', " ##### uuid:" + self.uuid);
                                    self.utilities.cl('Server', 'Winner: ' + payload['winIndex'], " ##### uuid:" + self.uuid);

                                    //
                                    for (var i = 0; i < self.playerNumLimitation; i++) {
                                        self.send(self.playerSockets[i], self.PlayerDataEmitEvent, data);
                                    }

                                    break;
                            }
                        } else if (role == 'player') {
                            //
                            switch (message) {
                                case 'control_instruction':
                                    self.send(self.appSocket, self.AppGameDataEmitEvent, data);
                                    break;
                            }
                        }
                    }
                });

                var resJson = {
                    message: 'register_response',
                    payload: {
                        uuid: self.uuid
                    }
                };
                // response for register request
                self.send(socket, self.AppGameDataEmitEvent, resJson);

                self.checkGameStatus();
            } else {
                self.utilities.cl('Server', 'App have been register', " ##### uuid:" + self.uuid);
                socket.emit('error', 'App have been register');
            }


        },

        addPlayerSocket: function (socket) {
            var self = this;

            // TODO: Use loop, not method of exhaustion
            if (self.playerSockets[0] === null || self.playerSockets[1] === null) {
                var tempIndex = -1;
                if (self.playerSockets[0] === null) {
                    tempIndex = 0;
                } else {
                    tempIndex = 1;
                }
                self.playerSockets[tempIndex] = socket;
                self.utilities.cl('Server', 'Player ' + tempIndex + ' connect', " ##### uuid:" + self.uuid);

                socket.on("disconnect", function () {
                    self.removePlayerSocket(socket);
                });

                // Main logic event
                //socket.on(self.ServerDataEmitEvent, self.process);

                socket.on(self.ServerDataEmitEvent, function (data) {
                    //
                    //var self = this;
                    //console.log(data);
                    if (data) {
                        var role = data['role'];
                        var message = data['message'];
                        var payload = data['payload'];

                        if (role == 'appgame') {

                        } else if (role == 'player') {
                            //
                            switch (message) {
                                case 'control_instruction':
                                    self.send(self.appSocket, self.AppGameDataEmitEvent, data);
                                    break;
                            }
                        }
                    }
                });

                var resJson = {
                    message: 'register_response',
                    payload: {
                        index: tempIndex
                    }
                };

                // response for register request
                self.send(socket, self.PlayerDataEmitEvent, resJson);

                self.checkGameStatus();
            } else {
                var resJson = {
                    message: 'register_failed',
                    payload: {}
                };
                self.utilities.cl('Server', 'Two Player have been register', " ##### uuid:" + self.uuid);
                self.send(socket, 'error', resJson);
            }


        },

        removeAppSocket: function (socket) {
            var self = this;
            self.appSocket = null;
            self.utilities.cl('Server', 'App have been removed', " ##### uuid:" + self.uuid);

            //TODO: remove itself
        },

        removePlayerSocket: function (socket) {
            var self = this;

            // TODO: Use loop, not method of exhaustion
            var tempIndex = -1;
            if (self.playerSockets[0] === socket) {
                self.playerSockets[0] = null;
                tempIndex = 0;
                // stop game
            } else {
                self.playerSockets[1] = null;
                tempIndex = 1;
            }

            self.utilities.cl('Server', 'Player ' + tempIndex + ' have been removed', " ##### uuid:" + self.uuid);
        },

        /*
         * Clean all socket, and reset status for next
         */
        clean: function () {
            var self = this;

            self.appSocket = null;

            for (var i = 0; i < self.playerNumLimitation; i++) {
                self.playerSockets[i] = null;
            }

            self.utilities.cl('Server', 'Reset Status', " ##### uuid:" + self.uuid);
        },

        /*
         * Function that check if the status meet the demand that there are 1 appgame and 2 players
         */
        checkGameStatus: function () {
            var self = this;
            if (self.appSocket != null) {
                for (var i = 0; i < self.playerNumLimitation; i++) {
                    if (self.playerSockets[i] === null) {
                        return;
                    }
                }

                // meet demand
                self.utilities.cl('Server', 'Game Start', " ##### uuid:" + self.uuid);

                var resJson = {
                    message: 'gamestart_response',
                    payload: {}
                };

                self.send(self.appSocket, self.AppGameDataEmitEvent, resJson);
                for (var i = 0; i < self.playerNumLimitation; i++) {
                    self.send(self.playerSockets[i], self.PlayerDataEmitEvent, resJson);
                }
            }
        },

        send: function (socket, event, message) {
            if (socket != null) {
                socket.emit(event, message);
            }
        },
    };
};