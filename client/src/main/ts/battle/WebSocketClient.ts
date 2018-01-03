import { PathNode, ShipData, Side, Texture } from "./util";
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
        this.makeRequest("textures", callback);
    }

    requestShips(callback: (ships: ShipData[]) => void) {
        this.makeRequest("ships", callback);
    }

    updateStatus() {
        this.makeRequest("status");
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

    requestBattleData(callback: (data: { playerSide: Side, fieldSize: game.Point,
        asteroids: game.Point[], clouds: game.Point[], units: Unit[], destroyedUnits: Unit[] }) => void) {
        this.makeRequest("battleData", callback);
    }

    requestPathsAndReachableCells(callback: (data: { paths: PathNode[][], reachableCells: game.Point[] }) => void) {
        this.makeRequest("pathsAndReachableCells", callback);
    }

    requestGunCells(gunId: number, callback: (data: { shotCells: game.Point[], targetCells: game.Point[] }) => void) {
        this.makeRequest("gunCells", callback, { gunId: gunId });
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

    private makeRequest(name: string, callback?: (data: any) => void, data?: any) {
        this.connection.prepareMessage(new Message("request" + name.charAt(0).toUpperCase() + name.slice(1), data));
        if (callback) {
            this.once(name, callback);
        }
    }
}

class WebSocketConnection extends PIXI.utils.EventEmitter {

    static readonly MESSAGE = "message";

    private readonly messagesToSend = new Array<Message>(0);
    private readonly webSocket: WebSocket;

    constructor() {
        super();
        const webSocketUrl: string = document.baseURI.toString().replace("http", "ws") + "/app";
        this.webSocket = new WebSocket(webSocketUrl);

        this.webSocket.onopen = () => {
            for (const message of this.messagesToSend) {
                this.sendMessage(message);
            }
            this.messagesToSend.length = 0;
        };
        this.webSocket.onmessage = e => this.emit(WebSocketConnection.MESSAGE, JSON.parse(e.data));
    }

    prepareMessage(message: Message) {
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

interface Unit {
    readonly actionPoints: number, readonly side: Side, readonly cell: game.Point, readonly ship: ShipData;
}

class Message {
    constructor(readonly subject: string, readonly data?: any) {}
}
