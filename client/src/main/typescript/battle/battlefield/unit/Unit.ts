import Field from "../Field";
import ProjectileService from "../projectile/ProjectileService";
import { ActionType, Cell, Gun, Hull, Side } from "../../util";
import * as game from "../../../game";
import * as PIXI from "pixi.js";

export default class Unit extends game.Actor {

    static readonly WIDTH = 64;
    static readonly HEIGHT = 32;
    static readonly ALPHA_DESTROYED = 0.5;

    static readonly PREPARED_TO_SHOT = "preparedToShot";
    static readonly NOT_PREPARED_TO_SHOT = "notPreparedToShot";
    static readonly DESTROY = "destroy";

    private _actionPoints = 0;
    private _preparedGunId = -1;
    private _firstGunCooldown = 0;
    private _secondGunCooldown = 0;
    private _isDestroyed = false;

    private _path: Cell[];

    constructor(readonly side: Side, private _cell: Cell, readonly hull: Hull, readonly firstGun: Gun,
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

    get cell(): Cell {
        return this._cell;
    }

    get firstGunCooldown(): number {
        return this._firstGunCooldown;
    }

    get secondGunCooldown(): number {
        return this._secondGunCooldown;
    }

    get actionPoints(): number {
        return this._actionPoints;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    get path(): Cell[] {
        return this._path;
    }

    set path(value: Cell[]) {
        this._path = value;
        if (value) {
            this._actionPoints -= value.length;
        }
    }

    get preparedGunId(): number {
        return this._preparedGunId;
    }

    set preparedGunId(value: number) {
        if (this.preparedGunId != value) {
            if (value == -1) {
                this._preparedGunId = -1;
                this.emit(Unit.NOT_PREPARED_TO_SHOT);
            } else if (value == this.firstGun.id || value == this.secondGun.id) {
                this._preparedGunId = value;
                this.emit(Unit.PREPARED_TO_SHOT);
            }
        }
    }

    get center(): Cell {
        return new Cell(this.x + this.width / 2, this.y + this.height / 2);
    }

    makeCurrent() {
        this._actionPoints = this.hull.speed;
        if (this.firstGunCooldown > 0) {
            this._firstGunCooldown--;
        }
        if (this.secondGunCooldown > 0) {
            this._secondGunCooldown--;
        }
    }

    shoot(target: Unit, gunId: number) {
        if (gunId == this.firstGun.id) {
            this._firstGunCooldown = this.firstGun.cooldown;
            this.projectileService.shoot(this.firstGun, target.center, this.center);
        } else if (gunId == this.secondGun.id) {
            this._secondGunCooldown = this.secondGun.cooldown;
            this.projectileService.shoot(this.secondGun, target.center, this.center);
        }

        this.projectileService.once(game.Event.DONE, () => {
            this.preparedGunId = -1;
            target.destroyUnit();
            this.emit(ActionType.Shot);
        });
    }

    destroyUnit() {
        this._isDestroyed = true;
        this.alpha = Unit.ALPHA_DESTROYED;
        this.emit(Unit.DESTROY);
    }

    protected update() {
        if (this.path) {
            if (this.path.length > 0) {
                this._cell = this.path.pop();
                this.updatePosition();
            } else {
                this.path = null;
                this.emit(ActionType.Move);
            }
        }
    }

    private updatePosition() {
        this.x = this.cell.x * Unit.WIDTH + Field.LINE_WIDTH / 2;
        this.y = this.cell.y * Unit.HEIGHT + Field.LINE_WIDTH / 2;
    }
}
