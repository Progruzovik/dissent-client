import * as druid from "pixi-druid";

export const enum Subject {

    Textures = "TEXTURES",
    Status = "STATUS",
    Ships = "SHIPS",
    Missions = "MISSIONS",
    BattleData = "BATTLE_DATA",
    PathsAndReachableCells = "PATHS_AND_REACHABLE_CELLS",
    GunCells = "GUN_CELLS",

    AddToQueue = "ADD_TO_QUEUE",
    RemoveFromQueue = "REMOVE_FROM_QUEUE",
    StartMission = "START_MISSION",
    MoveCurrentUnit = "MOVE_CURRENT_UNIT",
    ShootWithCurrentUnit = "SHOOT_WITH_CURRENT_UNIT",
    EndTurn = "END_TURN",

    Move = "MOVE",
    Shot = "SHOT",
    NextTurn = "NEXT_TURN",
    BattleFinish = "BATTLE_FINISH"
}

export const enum GunType {
    Artillery = "ARTILLERY",
    Beam = "BEAM",
    Shell = "SHELL"
}

export const enum Status {
    Idle = "IDLE", Queued = "QUEUED", InBattle = "IN_BATTLE"
}

export const enum Side {
    None = "NONE", Left = "LEFT", Right = "RIGHT"
}

export interface Gun {
    readonly id: number;
    readonly name: string;
    readonly shotCost: number;
    readonly damage: number;
    readonly radius: number;
    readonly accuracy: number;
    readonly typeName: GunType;
    readonly texture: Texture;
}

export interface Hull {
    readonly id: number;
    readonly name: string;
    readonly actionPoints: number;
    readonly strength: number;
    readonly width: number;
    readonly height: number;
    readonly texture: Texture;
}

export interface ShipData {
    readonly strength: number;
    readonly hull: Hull;
    readonly firstGun: Gun;
    readonly secondGun: Gun;
}

export interface Target {
    readonly cell: druid.Point, readonly hittingChance: number;
}

export interface Mission {
    readonly id: number, readonly name: string;
}

export interface Move {
    readonly cost: number, readonly cells: druid.Point[];
}

export interface PathNode {
    readonly movementCost: number, readonly cell: druid.Point;
}

export interface Shot {
    readonly gunId: number, readonly damage: number, readonly cell: druid.Point;
}

export interface Texture {
    readonly id: number, readonly name: string;
}

export interface Unit {
    readonly actionPoints: number, readonly side: Side, readonly firstCell: druid.Point, readonly ship: ShipData;
}

export class LogEntry {
    constructor(readonly side: Side, readonly damage: number, readonly isTargetDestroyed: boolean,
                readonly gunName: string, readonly unitHullName: string, readonly targetHullName: string) {}
}
