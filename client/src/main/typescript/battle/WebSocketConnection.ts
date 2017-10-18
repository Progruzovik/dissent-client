import { Subject } from "./util";
import * as PIXI from "pixi.js";

export default class WebSocketConnection extends PIXI.utils.EventEmitter {

    private readonly messageQueue = new Array<Message>(0);
    private webSocket: WebSocket;

    init() {
        this.webSocket = new WebSocket(document.baseURI.toString()
            .replace("http", "ws") + "/app");
        this.webSocket.onopen = () => {
            for (const message of this.messageQueue) {
                this.sendMessage(message);
            }
            this.messageQueue.length = 0;
        };
        this.webSocket.onmessage = (e: MessageEvent) => {
            const message: Message = JSON.parse(e.data);
            this.emit(Subject[message.subject], message.payload);
        };
    }

    requestStatus() {
        this.makeRequest(new Message(Method.Get, Subject.Status));
    }

    requestActions(fromNumber: number) {
        this.makeRequest(new Message(Method.Get, Subject.Action, fromNumber));
    }

    private makeRequest(message: Message) {
        if (this.webSocket.readyState == WebSocket.OPEN) {
            this.sendMessage(message);
        } else {
            this.messageQueue.push(message);
        }
    }

    private sendMessage(message: Message) {
        this.webSocket.send(JSON.stringify(message));
    }
}

const enum Method {
    Get, Post
}

class Message {
    constructor(readonly method: Method, readonly subject: Subject, readonly payload: any = 0) {}
}
