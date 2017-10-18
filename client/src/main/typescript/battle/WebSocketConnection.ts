import * as PIXI from "pixi.js";

export default class WebSocketConnection extends PIXI.utils.EventEmitter {

    static readonly STATUS = "status";

    private readonly messageQueue = new Array<Message>(0);
    private readonly webSocket = new WebSocket(document.baseURI.toString()
        .replace("http", "ws") + "/app");

    constructor() {
        super();
        this.webSocket.onopen = () => {
            for (const message of this.messageQueue) {
                this.webSocket.send(JSON.stringify(message));
            }
            this.messageQueue.length = 0;
        };
        this.webSocket.onmessage = (e: MessageEvent) => {
            const message: Message = JSON.parse(e.data);
            this.emit(message.title, message.payload)
        };
    }

    requestStatus() {
        this.makeRequest(new Message(WebSocketConnection.STATUS));
    }

    private makeRequest(message: Message) {
        if (this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(message));
        } else {
            this.messageQueue.push(message);
        }
    }
}

class Message {
    constructor(readonly title: string, readonly payload: string = "") {}
}
