
/**
 * 
 */
module.exports = new Class({
    appSocket: null,
    webPlayerSockets: {},
    // orderedSockets: {},

    // TODO: make json parsed in web and unity
    // For Message Protocol Formate
    formatemessagesJSONPath: "./lib/ConstantData.json",
    socketFormateMessages: {},

    messageEmitter: null,

    /**
     * @constructor
     * @param 
     */
    initialize: function() {

        var msgContents = require("fs").readFileSync(this.formatemessagesJSONPath, "utf8");
        this.socketFormateMessages = JSON.decode(msgContents);
        //
        // var msgContents = require("fs").readFileSync(this.messagesJSONPath, "utf8");
        // this.socketMessages = JSON.decode(msgContents);

        // set up emitter for event
        var Emitter = require('events').EventEmitter;
        this.messageEmitter = new Emitter();
    },

    /**
     * Wrapper event handler function so this class can talk back to its consumer
     */
    on: function(event, func) {
        this.messageEmitter.on(event, func);
    },

    processSocketMessage: function(socket, message) {

        if(message.role == this.socketFormateMessages.role.webPlayer) {
            this.processFromWeb(socket, message);
        } else {
            this.processFromApp(socket, message);
            
        }
    },

    processFromWeb: function(socket, message) {
        switch (message.data.message) {
            case this.socketFormateMessages.command.register:

                //TODO: check if contain the same socket
                //

                this.ConsoleLog("", message);
                var address = socket.handshake.address.address;
                this.webPlayerSockets[address] = socket;
                break;
            case this.socketFormateMessages.command.control:
                // Based on controll message, send control instruction to app game
                // 
                break;
            case this.socketFormateMessages.command.disconnect:
                //
                break;
        }
    },

    processFromApp: function(socket, message) {
        switch (message.data.command) {
            case this.socketFormateMessages.command.register:
                if(this.appSocket == null) {
                    this.ConsoleLog("Server", "App Game Connected");
                    this.appSocket = socket;
                } else {
                    this.ConsoleLog("Server", "App Socket has been registered");
                }
                break;
            case this.socketFormateMessages.command.disconnect:
                break;
        }
    },

    remove: function(socket) {
        // TODO: web or app send remove request to server, server remove it, 
        //       and then, it get response from server and call socket.disconnect()
    },

    sendWebsiteClientMessage: function(msgString, payloadData) {
        if (this.websiteMessagingSocket) {
            this.websiteMessagingSocket.emit("update", {msg: msgString, payload: payloadData});
        }
    },

    ConsoleLog: function(sender, message) {
        console.log("\n [" + sender + " Log] ->");
        console.log(message);
    },



});