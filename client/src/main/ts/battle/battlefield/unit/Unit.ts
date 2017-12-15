import Field from "../Field";
import ProjectileService from "../projectile/ProjectileService";
import { ActionType, Gun, Hull, Move, Shot, Side } from "../../util";
import * as game from "../../../game";
import * as PIXI from "pixi.js";

export default class Unit extends game.Actor {

    static readonly WIDTH = 64;
    static readonly HEIGHT = 32;
    static readonly ALPHA_DESTROYED = 0.5;

    static readonly UPDATE_STATS = "updateStats";
    static readonly PREPARE_TO_SHOT = "prepareToShot";
    static readonly NOT_PREPARE_TO_SHOT = "notPrepareToShot";
    static readonly DESTROY = "destroy";

    readonly frameColor: number;

    private _preparedGunId = -1;
    private _currentMove: Move;

    constructor(private _actionPoints: number, private _strength: number, playerSide: Side,
                readonly side: Side, private _cell: game.Point, readonly hull: Hull, readonly firstGun: Gun,
                readonly secondGun: Gun, private readonly projectileService?: ProjectileService) {
        super();
        this.interactive = true;
        this.frameColor = playerSide == this.side ? 0x00ff00 : 0xff0000;
        const sprite = new PIXI.Sprite(PIXI.loader.resources[hull.texture.name].texture);
        if (side == Side.Right) {
            sprite.scale.x = -1;
            sprite.anchor.x = 1;
        }
        this.addChild(sprite);
        this.addChild(new game.Frame(sprite.width, sprite.height, 0.6, this.frameColor));
        this.updatePosition();
    }

    get actionPoints(): number {
        return this._actionPoints;
    }

    get strength(): number {
        return this._strength;
    }

    set strength(value: number) {
        if (value <= 0) {
            this._strength = 0;
            this.alpha = Unit.ALPHA_DESTROYED;
            this.emit(Unit.DESTROY);
        } else if (value >= this.hull.strength) {
            this._strength = this.hull.strength;
        } else {
            this._strength = value;
        }
    }

    get cell(): game.Point {
        return this._cell;
    }

    get currentMove(): Move {
        return this._currentMove;
    }

    set currentMove(value: Move) {
        this._currentMove = value;
        if (value) {
            this._actionPoints -= value.cost;
        }
    }

    get preparedGunId(): number {
        return this._preparedGunId;
    }

    set preparedGunId(value: number) {
        if (this.preparedGunId != value) {
            if (value == -1) {
                this._preparedGunId = -1;
                this.emit(Unit.NOT_PREPARE_TO_SHOT);
            } else if (value == this.firstGun.id || value == this.secondGun.id) {
                this._preparedGunId = value;
                this.emit(Unit.PREPARE_TO_SHOT);
            }
        }
    }

    get center(): game.Point {
        return new game.Point(this.x + this.width / 2, this.y + this.height / 2);
    }

    makeCurrent() {
        this._actionPoints = this.hull.actionPoints;
    }

    shoot(target: Unit, shot: Shot) {
        let activeGun: Gun = null;
        if (shot.gunId == this.firstGun.id) {
            activeGun = this.firstGun;
        } else if (shot.gunId == this.secondGun.id) {
            activeGun = this.secondGun;
        }
        this._actionPoints -= activeGun.shotCost;
        this.projectileService.shoot(activeGun, this.center, target.center);

        this.projectileService.once(game.Event.DONE, () => {
            this._preparedGunId = -1;
            target.strength -= shot.damage;
            target.emit(Unit.UPDATE_STATS);
            this.emit(ActionType.Shot);
        });
    }

    createIcon(): PIXI.Container {
        const result = new PIXI.Container();
        result.addChild(new PIXI.Sprite(PIXI.loader.resources[this.hull.texture.name].texture));
        result.addChild(new game.Frame(Unit.WIDTH, Unit.HEIGHT, 1, this.frameColor));
        return result;
    }

    protected update() {
        if (this.currentMove) {
            if (this.currentMove.cells.length > 0) {
                this._cell = this.currentMove.cells.pop();
                this.updatePosition();
            } else {
                this.currentMove = null;
                this.emit(ActionType.Move);
            }
        }
    }

    private updatePosition() {
        this.x = this.cell.x * Unit.WIDTH + Field.LINE_WIDTH / 2;
        this.y = this.cell.y * Unit.HEIGHT + Field.LINE_WIDTH / 2;
    }
}
