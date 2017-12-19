import { Gun, Hull, PathNode, Side, Texture } from "./util";
import * as game from "../game";
import * as PIXI from "pixi.js";

export default class WebSocketClient extends PIXI.utils.EventEmitter {

    static readonly STATUS = "status";

    private readonly connection = new WebSocketConnection();

    constructor() {
        super();
        this.connection.on(WebSocketConnection.MESSAGE, (message: Message) =>
            this.emit(message.subject, message.data));
    }

    requestTextures(callback: (textures: Texture[]) => void) {
        this.connection.prepareRequest("textures", callback);
    }

    updateStatus() {
        this.connection.prepareRequest("status");
    }

    addToQueue() {
        this.connection.prepareMessage(new Message("addToQueue"));
    }

    removeFromQueue() {
        this.connection.prepareMessage(new Message("removeFromQueue"));
    }

    startScenario() {
        this.connection.prepareMessage(new Message("startScenario"));
    }

    requestBattleData(callback: (data: { playerSide: Side, fieldSize: game.Point, hulls: Hull[], guns: Gun[],
        asteroids: game.Point[], clouds: game.Point[], units: Unit[], destroyedUnits: Unit[] }) => void) {
        this.connection.prepareRequest("battleData", callback);
    }

    requestPathsAndReachableCells(callback: (data: { paths: PathNode[][], reachableCells: game.Point[] }) => void) {
        this.connection.prepareRequest("pathsAndReachableCells", callback);
    }

    requestGunCells(gunId: number, callback: (data: { shotCells: game.Point[], targetCells: game.Point[] }) => void) {
        this.connection.prepareRequest("gunCells", callback, { gunId: gunId });
    }

    moveCurrentUnit(cell: game.Point) {
        this.connection.prepareMessage(new Message("moveCurrentUnit", cell));
    }

    shootWithCurrentUnit(gunId: number, cell: game.Point) {
        this.connection.prepareMessage(new Message("shootWithCurrentUnit", { gunId: gunId, x: cell.x, y: cell.y }));
    }

    endTurn() {
        this.connection.prepareMessage(new Message("endTurn"));
    }
}

class WebSocketConnection extends PIXI.utils.EventEmitter {

    static readonly MESSAGE = "message";

    private readonly messagesToSend = new Array<Message>(0);
    private readonly webSocket: WebSocket;

    private readonly callbacks = new Array<(data: any) => void>(0);

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
            if (this.callbacks[message.subject]) {
                this.callbacks[message.subject](message.data);
                this.callbacks[message.subject] = null;
            } else {
                console.log(message);
                this.emit(WebSocketConnection.MESSAGE, message);
            }
        };
    }

    prepareMessage(message: Message) {
        if (this.webSocket.readyState == WebSocket.OPEN) {
            this.sendMessage(message);
        } else {
            this.messagesToSend.push(message);
        }
    }

    prepareRequest(name: string, callback?: (data: any) => void, data?: any) {
        this.callbacks[name] = callback;
        const requestName: string = name.charAt(0).toUpperCase() + name.slice(1);
        this.prepareMessage(new Message(`request${requestName}`, data));
    }

    private sendMessage(message: Message) {
        this.webSocket.send(JSON.stringify(message));
    }
}

class Message {
    constructor(readonly subject: string, readonly data?: any) {}
}

class Ship {
    constructor(readonly strength: number, readonly hullId: number,
                readonly firstGunId: number, readonly secondGunId: number) {}
}

class Unit {
    constructor(readonly actionPoints: number, readonly side: Side, readonly cell: game.Point, readonly ship: Ship) {}
}
