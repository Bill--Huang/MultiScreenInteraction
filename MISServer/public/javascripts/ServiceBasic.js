/**
 * Created by huangzebiao on 15-3-24.
 */
var ServiceBasic = {

    socket: null,
    ServerDataEmitEvent: 'ServerDataEmitEvent',
    role: null,

    // if role is appgame, it will be -1
    playerindex: -1,

    // if role is player, it will be false
    instructionsFromPlayer: {},

    GameState: {
        NoConnect: -1,
        Waiting: 0,
        Playing: 1,
        End: 2
    },

    currentGameState : -1,

    // Event
    OnConnection: null,
    OnConnectionError: null,
    OnGameStart: null,
    OnGameEnd: null,
    OnGameStateChange: null,

    init: function(OnConnect, OnStart, OnEnd, OnChange, OnError) {
        console.log('Init Service Basic');
        var self = this;

        self.OnConnection = OnConnect;
        self.OnConnectionError = OnError;
        self.OnGameStart = OnStart;
        self.OnGameEnd = OnEnd;
        self.OnGameStateChange = OnChange;
    },

    connect: function(route) {
        var self = this;
        var hostport = document.location.host;
        self.role = route;

        // null means localhost
        self.socket = io.connect(hostport + '/' + route);

        self.socket.on('connect', function(){
            console.log('Connected to Server');
        });

        self.socket.on('disconnect', function(){
            console.log('Disconnected to Server');
        });

        self.socket.on('error', function(data){
            console.log(data);
            if(data['message'] == 'register_failed') {
                self.OnConnectionError('玩家数已满，请先等待');
            } else if(data['message'] == 'link_outdated') {
                self.OnConnectionError('链接已过时，请重新扫码连接');
            }
        });

        if(self.role == 'appgame') {
            self.socket.on('AppGameDataEmitEvent', self.AppGameDataEmitEvent);
            self.instructionsFromPlayer[0] = null;
            self.instructionsFromPlayer[1] = null;
        } else {
            self.socket.on('PlayerDataEmitEvent', self.PlayerDataEmitEvent);
        }
    },

    /*
     * it is called by socket, so 'this' has been polluted
     * so use 'ServiceBasic'
     */
    AppGameDataEmitEvent: function(data) {

        console.log('AppGame: get data from server');
        ServiceBasic.AppGameProcess(data);
    },

    AppGameProcess: function(data) {
        var self = this;

        if(data) {
            var type = data['message'];
            var payload = data['payload'];
            //console.log(data);
            switch (type) {
                case 'register_response':
                    console.log('register successfully');

                    self.currentGameState = self.GameState['Waiting'];
                    // update UI
                    self.OnConnection(payload.uuid);
                    self.OnGameStateChange(self.currentGameState);
                    //self.updateGameRole();
                    break;
                case 'gamestart_response':
                    self.currentGameState = self.GameState['Playing'];
                    self.OnGameStateChange(self.currentGameState);
                    console.log('Game Start!');

                    self.OnGameStart();

                    break;
                case 'control_instruction':
                    console.log('AppGame: get control instruction');
                    self.GameLogicUpdate(payload);

                    break;
            }
        }
    },

    /*
     * function that run instruction from player and update game
     */
    GameLogicUpdate: function(payload) {
        var self = this;

        //console.log(payload);
        var index = payload['index'];
        var click = payload['click'];

        self.instructionsFromPlayer[index] = click;

        if(self.instructionsFromPlayer[0] != null && self.instructionsFromPlayer[1] != null) {

            // find out winner index
            var win = 0;
            if(self.instructionsFromPlayer[0] == self.instructionsFromPlayer[1]) {
                win = -1;
            } else if(self.instructionsFromPlayer[0] < self.instructionsFromPlayer[1]) {
                win = 1;
            }

            // call end event
            self.OnGameEnd(self.instructionsFromPlayer, win, function(d1, d2) {
                // send request
                // send end to server
                var data = {
                    role: 'appgame',
                    message: 'gameend_request',
                    payload: {
                        winIndex: win,
                        distance: {
                            '1': d1,
                            '2': d2
                        }
                    }
                };

                console.log('1 路程: ' + (d1 - 2));
                console.log('2 路程: ' + (d2 - 2));


                ServiceBasic.send(data);
                // reset
                self.instructionsFromPlayer = {};
                self.currentGameState = self.GameState['Waiting'];

                console.log('Game End And Refresh Game');
            });


        }
    },

    PlayerDataEmitEvent: function(data) {
        //
        console.log('Player: get data from server');
        ServiceBasic.PlayerProcess(data);
    },

    PlayerProcess: function(data) {
        var self = this;

        if(data) {
            var type = data['message'];
            var payload = data['payload'];

            switch (type) {
                case 'register_response':
                    self.playerindex = payload['index'];
                    console.log("I'm Player " + self.playerindex);
                    self.currentGameState = self.GameState['Waiting'];
                    self.OnConnection(self.playerindex);
                    // update UI
                    self.OnGameStateChange(self.currentGameState, self.playerindex);
                    //self.updateGameRole();

                    // TODO: showing wait view for game start
                    break;
                case 'gamestart_response':
                    self.currentGameState = self.GameState['Playing'];
                    self.OnGameStateChange(self.currentGameState, self.playerindex);
                    console.log('Game Start!');
                    self.OnGameStart();
                    break;
                case 'gameend_request':
                    console.log('Game End and disconnect');
                    self.currentGameState = self.GameState['End'];
                    self.OnGameStateChange(self.currentGameState, self.playerindex);
                    // TODO: show bonus
                    self.OnGameEnd(payload['winIndex'], self.playerindex);
                    // disconnect
                    self.disconnect();
                    break;

            }
        }
    },

    /*
     * Send data to Server by Emit Function
     */
    send : function(data) {
        ServiceBasic.socket.emit(ServiceBasic.ServerDataEmitEvent, data);
    },

    disconnect: function() {
        var self = this;
        self.socket.disconnect();
    },

    /*
     * UI Part
     */
    //updateGameRole: function() {
    //    var self = this;
    //    var roleS = '';
    //    if(self.role == 'appgame') {
    //        roleS += self.role;
    //    } else {
    //        roleS = self.role + ' ' + self.playerindex;
    //    }
    //    $('#game-role').text(roleS);
    //},
};