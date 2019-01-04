import { LogEntry, Mission, PathNode, ShipData, Side, Status, Subject, Target, Texture, Unit } from "./model/util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class WebSocketClient extends PIXI.utils.EventEmitter {

    private readonly connection: WebSocketConnection;

    constructor(url: string) {
        super();
        this.connection = new WebSocketConnection(url);
        this.connection.on(WebSocketConnection.MESSAGE, (message: Message) =>
            this.emit(message.subject, message.data));
    }

    requestTextures(): Promise<Texture[]> {
        return this.createRequest(Subject.Textures);
    }

    requestShips(): Promise<ShipData[]> {
        return this.createRequest(Subject.Ships);
    }

    requestMissions(): Promise<Mission[]> {
        return this.createRequest(Subject.Missions);
    }

    requestStatus(): Promise<Status> {
        return this.createRequest(Subject.Status);
    }

    addToQueue() {
        this.connection.prepareMessage(new Message(Subject.AddToQueue));
    }

    removeFromQueue() {
        this.connection.prepareMessage(new Message(Subject.RemoveFromQueue));
    }

    startMission(missionId: number) {
        this.connection.prepareMessage(new Message(Subject.StartMission, { missionId: missionId }));
    }

    requestBattleData(): Promise<BattleData> {
        return this.createRequest(Subject.BattleData);
    }

    requestPathsAndReachableCells(): Promise<{ paths: PathNode[][], reachableCells: druid.Point[] }> {
        return this.createRequest(Subject.PathsAndReachableCells);
    }

    requestGunCells(gunId: number): Promise<{ targets: Target[], shotCells: druid.Point[] }> {
        return this.createRequest(Subject.GunCells, { gunId: gunId });
    }

    moveCurrentUnit(cell: druid.Point) {
        this.connection.prepareMessage(new Message(Subject.MoveCurrentUnit, cell));
    }

    shootWithCurrentUnit(gunId: number, cell: druid.Point) {
        const message = new Message(Subject.ShootWithCurrentUnit, { gunId: gunId, x: cell.x, y: cell.y });
        this.connection.prepareMessage(message);
    }

    endTurn() {
        this.connection.prepareMessage(new Message(Subject.EndTurn));
    }

    private createRequest<T>(name: string, data?: any): Promise<T> {
        return new Promise<T>(resolve => {
            const requestName = `REQUEST_${name}`;
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
