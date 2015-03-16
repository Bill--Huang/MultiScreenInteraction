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
        this.socket.On("AppDataEmitEvent", (data) => {
            Debug.Log("message: " + data);
        });
    }

    private void SocketOpened(object sender, EventArgs e) {
        Debug.Log("socket opened");
    }

    private void SocketMessage(object sender, MessageEventArgs e) {
        if (e != null && e.Message.Event == "message") {
            string msg = e.Message.MessageText;
            Debug.Log(msg);
            this.GUIMessage = msg;
        }
    }

    private void SocketConnectionClosed(object sender, EventArgs e) {
        Debug.Log("SocketConnectionClosed");
    }

    public void SocketError(object sender, ErrorEventArgs e) {
        this.GUIMessage = e.Message.ToString();
        Debug.Log(e.Message.ToString());
        Debug.Log(e.Exception.Message);
    }

    void OnGUI() {
        GUI.Label(new Rect(100,100,400,400), "Status: " + this.GUIMessage);
    }
}
