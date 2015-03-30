using UnityEngine;
using System;
using System.Collections;
using WebSocket4Net;
using SocketIOClient;
using SimpleJson;

public class TestConnect : MonoBehaviour {

    private string GUIMessage = "No Connection";

    private Client socket;
    private string serverURLString = "http://192.168.1.107:1991";

	// Use this for initialization
	void Start () {
        Debug.Log("socket url: " + serverURLString);

        this.socket = new Client(serverURLString);

        this.socket.Opened += SocketOpened;
        this.socket.Message += SocketMessage;
        this.socket.SocketConnectionClosed += SocketConnectionClosed;
        this.socket.Error += SocketError;

        this.SetSocketEvent();

        this.socket.Connect();

	}

    
    private void SetSocketEvent() {

        // Can not get all raw message, only data
        //this.socket.On("AppDataEmitEvent", (data) => {
        //    Debug.Log("Message Unity: " + data);
        //});
    }

    private void SocketOpened(object sender, EventArgs e) {
        this.GUIMessage = "SocketOpened";
        Debug.Log("SocketOpened");

        this.socket.Emit("ServerDataEmitEvent", "App Message");
    }

    private void SocketMessage(object sender, MessageEventArgs e) {

        // Event Handler, get all raw message
        if (e != null && e.Message.Event == "AppDataEmitEvent") {
            Debug.Log(e.Message.Event);
            Debug.Log(e.Message.MessageText);
        }

        //this.GUIMessage = "SocketMessage";
        //Debug.Log("SocketMessage");
    }

    private void SocketConnectionClosed(object sender, EventArgs e) {
        this.GUIMessage = "SocketConnectionClosed";
        Debug.Log("SocketConnectionClosed");
    }

    public void SocketError(object sender, ErrorEventArgs e) {
        this.GUIMessage = e.Message.ToString();
        Debug.Log(e.Message.ToString());
    }

    void OnApplicationQuit() {
        this.socket.Close();
        this.socket.Dispose();
        Debug.Log("Socket Closed");
    }

    void OnGUI() {
        GUI.Label(new Rect(100,100,400,400), "Status: " + this.GUIMessage);
    }
}
