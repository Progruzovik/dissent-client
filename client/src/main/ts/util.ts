import * as druid from "pixi-druid";
import * as m from "mithril";
import { CVnode } from "mithril";

export const enum ActionType {
    Move = "move",
    Shot = "shot",
    NextTurn = "nextTurn",
    BattleFinish = "battleFinish"
}

export const enum GunType {
    Artillery = "artillery",
    Beam = "beam",
    Shell = "shell"
}

export enum Status {
    Idle, Queued, InBattle
}

export const enum Side {
    None, Left, Right
}

export interface Gun {
    readonly id: number,
    readonly name: string,
    readonly shotCost: number,
    readonly damage: number,
    readonly radius: number,
    readonly typeName: GunType,
    readonly texture: Texture;
}

export interface Hull {
    readonly id: number,
    readonly name: string,
    readonly actionPoints: number,
    readonly strength: number,
    readonly width: number,
    readonly height: number,
    readonly texture: Texture;
}

export interface ShipData {
    readonly strength: number;
    readonly hull: Hull;
    readonly firstGun: Gun;
    readonly secondGun: Gun;
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

export interface LogEntry {
    readonly damage: number, readonly gunName: string, readonly unitHullName: string, readonly targetHullName: string;
}

export interface Texture {
    readonly id: number, readonly name: string;
}

export abstract class MenuComponent implements m.ClassComponent {

    constructor(m: m.Hyperscript) {}

    abstract view(vnode?: CVnode): m.Children;
}

export class Page implements m.RouteResolver {

    constructor(private readonly layout: MenuComponent, private readonly content: MenuComponent) {}

    render(vnode: CVnode) {
        return m(this.layout, m(this.content, vnode.attrs));
    }
}
