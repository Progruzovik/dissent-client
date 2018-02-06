import { Gun, Hull, ShipData } from "../util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class Ship implements ShipData {

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

    get guns(): Gun[] {
        const result: Gun[] = [];
        if (this.firstGun) {
            result.push(this.firstGun);
        }
        if (this.secondGun) {
            result.push(this.secondGun);
        }
        return result;
    }

    createSprite(): PIXI.Sprite {
        return new PIXI.Sprite(PIXI.loader.resources[this.hull.texture.name].texture);
    }

    createStrengthBar(width: number, height: number = 15, color: number = 0xff0000): druid.ProgressBar {
        const result = new druid.ProgressBar(width, height, color, druid.BarTextConfig.Default, this.hull.strength);
        result.value = this.strength;
        return result;
    }
}
