import * as PIXI from "pixi.js";
import { Cell, Texture } from "./util";

export default class WebSocketConnection extends PIXI.utils.EventEmitter {

    static readonly STATUS = "status";

    private readonly messagesToSend = new Array<Message>(0);
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
        this.webSocket.onmessage = e => {
            const message: Message = JSON.parse(e.data);
            this.emit(message.subject, message.data);
        };
    }

    requestTextures(callback: (textures: Texture[]) => void) {
        this.prepareMessage(new Message("requestTextures"));
        this.once("textures", callback);
    }

    requestStatus() {
        this.prepareMessage(new Message("requestStatus"));
    }

    addToQueue() {
        this.prepareMessage(new Message("addToQueue"));
    }

    removeFromQueue() {
        this.prepareMessage(new Message("removeFromQueue"));
    }

    startScenario() {
        this.prepareMessage(new Message("startScenario"));
    }

    requestReachableCellsAndPaths(callback: (data: { reachableCells: Cell[], paths: Cell[][] }) => void) {
        this.prepareMessage(new Message("requestReachableCellsAndPaths"));
        this.once("reachableCellsAndPaths", callback);
    }

    requestShotAndTargetCells(gunId: number, callback: (data: { shotCells: Cell[], targetCells: Cell[] }) => void) {
        this.prepareMessage(new Message("requestShotAndTargetCells", { gunId: gunId }));
        this.once("shotAndTargetCells", callback);
    }

    moveCurrentUnit(cell: Cell) {
        this.prepareMessage(new Message("moveCurrentUnit", cell));
    }

    shootWithCurrentUnit(gunId: number, cell: Cell) {
        this.prepareMessage(new Message("shootWithCurrentUnit", { gunId: gunId, x: cell.x, y: cell.y }));
    }

    endTurn() {
        this.prepareMessage(new Message("endTurn"));
    }

    private prepareMessage(message: Message) {
        if (this.webSocket.readyState == WebSocket.OPEN) {
            this.sendMessage(message);
        } else {
            this.messagesToSend.push(message);
        }
    }

    private sendMessage(message: Message) {
        this.webSocket.send(JSON.stringify(message));
    }
}

class Message {
    constructor(readonly subject: string, readonly data?: any) {}
}
