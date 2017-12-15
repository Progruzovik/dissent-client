import { Gun, Hull, PathNode, Side, Texture } from "./util";
import * as game from "../game";
import * as PIXI from "pixi.js";

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

    requestBattleData(callback: (data: { playerSide: Side, fieldSize: game.Point, hulls: Hull[], guns: Gun[],
        asteroids: game.Point[], clouds: game.Point[], units: Unit[], destroyedUnits: Unit[] }) => void) {
        this.prepareMessage(new Message("requestBattleData"));
        this.once("battleData", callback);
    }

    requestPathsAndReachableCells(callback: (data: { paths: PathNode[][], reachableCells: game.Point[] }) => void) {
        this.prepareMessage(new Message("requestPathsAndReachableCells"));
        this.once("pathsAndReachableCells", callback);
    }

    requestGunCells(gunId: number, callback: (data: { shotCells: game.Point[], targetCells: game.Point[] }) => void) {
        this.prepareMessage(new Message("requestGunCells", { gunId: gunId }));
        this.once("gunCells", callback);
    }

    moveCurrentUnit(cell: game.Point) {
        this.prepareMessage(new Message("moveCurrentUnit", cell));
    }

    shootWithCurrentUnit(gunId: number, cell: game.Point) {
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

class Ship {
    constructor(readonly strength: number, readonly hullId: number,
                readonly firstGunId: number, readonly secondGunId: number) {}
}

class Unit {
    constructor(readonly actionPoints: number, readonly side: Side, readonly cell: game.Point, readonly ship: Ship) {}
}
