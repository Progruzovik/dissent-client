import { Gun, Hull, ShipData } from "../util";

export default class Ship {

    private _strength: number;

    readonly hull: Hull;
    readonly firstGun: Gun;
    readonly secondGun: Gun;

    constructor(data: ShipData) {
        this._strength = data.strength;
        this.hull = data.hull;
        this.firstGun = data.firstGun;
        this.secondGun = data.secondGun;
    }

    get strength(): number {
        return this._strength;
    }

    set strength(value: number) {
        if (value < 0) {
            this._strength = 0;
        } else if (value > this.hull.strength) {
            this._strength = this.hull.strength;
        } else {
            this._strength = value;
        }
    }

    createIcon(): PIXI.Container {
        return new PIXI.Sprite(PIXI.loader.resources[this.hull.texture.name].texture);
    }
}
