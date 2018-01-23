import { PathNode, ShipData, Side, Texture } from "./util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class WebSocketClient extends PIXI.utils.EventEmitter {

    static readonly STATUS = "status";

    private connection: WebSocketConnection;

    createConnection(url: string) {
        this.connection = new WebSocketConnection(url);
        this.connection.on(WebSocketConnection.MESSAGE, (message: Message) =>
            this.emit(message.subject, message.data));
    }

    requestTextures(callback: (textures: Texture[]) => void) {
        this.makeRequest("textures", callback);
    }

    requestShips(callback: (ships: ShipData[]) => void) {
        this.makeRequest("ships", callback);
    }

    requestMissions(callback: (missions: string[]) => void) {
        this.makeRequest("missions", callback);
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

    startMission(missionIndex: number) {
        this.connection.prepareMessage(new Message("startMission", { missionIndex: missionIndex }));
    }

    requestBattleData(callback: (data: { playerSide: Side, fieldSize: druid.Point,
        asteroids: druid.Point[], clouds: druid.Point[], units: Unit[], destroyedUnits: Unit[] }) => void) {
        this.makeRequest("battleData", callback);
    }

    requestPathsAndReachableCells(callback: (data: { paths: PathNode[][], reachableCells: druid.Point[] }) => void) {
        this.makeRequest("pathsAndReachableCells", callback);
    }

    requestGunCells(gunId: number,
                    callback: (data: { shotCells: druid.Point[], targetCells: druid.Point[] }) => void) {
        this.makeRequest("gunCells", callback, { gunId: gunId });
    }

    moveCurrentUnit(cell: druid.Point) {
        this.connection.prepareMessage(new Message("moveCurrentUnit", cell));
    }

    shootWithCurrentUnit(gunId: number, cell: druid.Point) {
        this.connection.prepareMessage(new Message("shootWithCurrentUnit",
            { gunId: gunId, x: cell.x, y: cell.y }));
    }

    endTurn() {
        this.connection.prepareMessage(new Message("endTurn"));
    }

    private makeRequest(name: string, callback?: (data: any) => void, data?: any) {
        const request = "request" + name.charAt(0).toUpperCase() + name.slice(1);
        this.connection.prepareMessage(new Message(request, data));
        if (callback) {
            this.once(name, callback);
        }
    }
}

interface Unit {
    readonly actionPoints: number, readonly side: Side, readonly firstCell: druid.Point, readonly ship: ShipData;
}

class Message {
    constructor(readonly subject: string, readonly data?: any) {}
}

class WebSocketConnection extends PIXI.utils.EventEmitter {

    static readonly MESSAGE = "message";

    private readonly messagesToSend = new Array<Message>(0);
    private readonly webSocket: WebSocket;

    constructor(url: string) {
        super();
        this.webSocket = new WebSocket(url);

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
