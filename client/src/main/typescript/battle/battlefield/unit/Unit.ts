import Field from "../Field";
import ProjectileService from "../projectile/ProjectileService";
import { ActionType, Cell, Gun, Hull, Move, Shot, Side } from "../../util";
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

    private _preparedGunId = -1;
    private _currentMove: Move;

    constructor(private _actionPoints: number, private _strength: number,
                readonly side: Side, private _cell: Cell, readonly hull: Hull, readonly firstGun: Gun,
                readonly secondGun: Gun, private readonly projectileService: ProjectileService) {
        super();
        this.interactive = true;
        const sprite = new PIXI.Sprite(PIXI.loader.resources[hull.texture.name].texture);
        if (side == Side.Right) {
            sprite.scale.x = -1;
            sprite.anchor.x = 1;
        }
        this.addChild(sprite);
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

    get cell(): Cell {
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

    get center(): Cell {
        return new Cell(this.x + this.width / 2, this.y + this.height / 2);
    }

    makeCurrent() {
        this._actionPoints = this.hull.actionPoints;
    }

    shoot(target: Unit, shot: Shot) {
        if (shot.gunId == this.firstGun.id) {
            this._actionPoints -= this.firstGun.shotCost;
            this.projectileService.shoot(this.firstGun, target.center, this.center);
        } else if (shot.gunId == this.secondGun.id) {
            this._actionPoints -= this.secondGun.shotCost;
            this.projectileService.shoot(this.secondGun, target.center, this.center);
        }

        this.projectileService.once(game.Event.DONE, () => {
            this._preparedGunId = -1;
            target.strength -= shot.damage;
            target.emit(Unit.UPDATE_STATS);
            this.emit(ActionType.Shot);
        });
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
