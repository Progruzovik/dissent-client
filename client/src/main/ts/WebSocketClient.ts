import { LogEntry, Mission, PathNode, ShipData, Side, Status, Target, Texture, Unit } from "./model/util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class WebSocketClient extends PIXI.utils.EventEmitter {

    static readonly STATUS = "status";

    private readonly connection: WebSocketConnection;

    constructor(url: string) {
        super();
        this.connection = new WebSocketConnection(url);
        this.connection.on(WebSocketConnection.MESSAGE, (message: Message) =>
            this.emit(message.subject, message.data));
    }

    requestTextures(): Promise<Texture[]> {
        return this.createRequest("textures");
    }

    requestShips(): Promise<ShipData[]> {
        return this.createRequest("ships");
    }

    requestMissions(): Promise<Mission[]> {
        return this.createRequest("missions");
    }

    requestStatus(): Promise<Status> {
        return this.createRequest(WebSocketClient.STATUS);
    }

    addToQueue() {
        this.connection.prepareMessage(new Message("addToQueue"));
    }

    removeFromQueue() {
        this.connection.prepareMessage(new Message("removeFromQueue"));
    }

    startMission(missionId: number) {
        this.connection.prepareMessage(new Message("startMission", { missionId: missionId }));
    }

    requestBattleData(): Promise<BattleData> {
        return this.createRequest("battleData");
    }

    requestPathsAndReachableCells(): Promise<{ paths: PathNode[][], reachableCells: druid.Point[] }> {
        return this.createRequest("pathsAndReachableCells");
    }

    requestGunCells(gunId: number): Promise<{ targets: Target[], shotCells: druid.Point[] }> {
        return this.createRequest("gunCells", { gunId: gunId });
    }

    moveCurrentUnit(cell: druid.Point) {
        this.connection.prepareMessage(new Message("moveCurrentUnit", cell));
    }

    shootWithCurrentUnit(gunId: number, cell: druid.Point) {
        this.connection.prepareMessage(new Message("shootWithCurrentUnit", { gunId: gunId, x: cell.x, y: cell.y }));
    }

    endTurn() {
        this.connection.prepareMessage(new Message("endTurn"));
    }

    private createRequest<T>(name: string, data?: any): Promise<T> {
        return new Promise<T>(resolve => {
            const requestName = `request${name.charAt(0).toUpperCase()}${name.slice(1)}`;
            this.connection.prepareMessage(new Message(requestName, data));
            this.once(name, resolve);
        });
    }
}

interface BattleData {
    readonly playerSide: Side;
    readonly fieldSize: druid.Point;
    readonly log: LogEntry[];
    readonly asteroids: druid.Point[];
    readonly clouds: druid.Point[];
    readonly units: Unit[];
    readonly destroyedUnits: Unit[];
}

class Message {
    constructor(readonly subject: string, readonly data?: any) {}
}

class WebSocketConnection extends PIXI.utils.EventEmitter {

    static readonly MESSAGE = "message";

    private readonly messagesToSend: Message[] = [];
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
