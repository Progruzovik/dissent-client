import * as PIXI from "pixi.js";

export default class WebSocketConnection extends PIXI.utils.EventEmitter {

    static readonly STATUS = "status";

    private readonly messagesToSend = new Array<ClientMessage>(0);
    private webSocket: WebSocket;

    constructor() {
        super();
        this.webSocket = new WebSocket(document.baseURI.toString()
            .replace("http", "ws") + "/app");
        this.webSocket.onopen = () => {
            for (const message of this.messagesToSend) {
                this.sendMessage(message);
            }
            this.messagesToSend.length = 0;
        };
        this.webSocket.onmessage = (e: MessageEvent) => {
            const message: ServerMessage = JSON.parse(e.data);
            this.emit(message.subject, message.payload);
        };
    }

    requestStatus() {
        this.prepareMessage("requestStatus");
    }

    addToQueue() {
        this.prepareMessage("addToQueue");
    }

    removeFromQueue() {
        this.prepareMessage("removeFromQueue");
    }

    startScenario() {
        this.prepareMessage("startScenario");
    }

    endTurn() {
        this.prepareMessage("endTurn");
    }

    private prepareMessage(subject: string) {
        const message = new ClientMessage(subject);
        if (this.webSocket.readyState == WebSocket.OPEN) {
            this.sendMessage(message);
        } else {
            this.messagesToSend.push(message);
        }
    }

    private sendMessage(message: ClientMessage) {
        this.webSocket.send(JSON.stringify(message));
    }
}

class ClientMessage {
    constructor(readonly subject: string) {}
}

class ServerMessage {
    constructor(readonly subject: string, readonly payload: any) {}
}
