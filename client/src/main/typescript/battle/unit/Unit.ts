import Hull from "./Hull";
import Field from "../Field";
import ProjectileService from "../projectile/ProjectileService";
import { Gun, Side } from "../request";
import * as game from "../../game";

export default class Unit extends game.Actor {

    static readonly WIDTH = 64;
    static readonly HEIGHT = 32;

    static readonly MOVE = "move";
    static readonly PREPARED_TO_SHOT = "preparedToShot";
    static readonly SHOT = "shot";
    static readonly NOT_PREPARED_TO_SHOT = "notPreparedToShot";
    static readonly DESTROY = "destroy";

    private _movementPoints = 0;
    private _preparedGunId = -1;
    private _firstGunCooldown = 0;
    private _secondGunCooldown = 0;
    private _isDestroyed = false;

    private _path: game.Direction[];
    private oldCell: PIXI.Point;

    constructor(readonly side: Side, readonly cell: PIXI.Point, readonly hull: Hull, readonly firstGun: Gun,
                readonly secondGun: Gun, private readonly projectileService: ProjectileService) {
        super();
        this.interactive = true;
        const sprite = new PIXI.Sprite(hull.texture);
        if (side == Side.Right) {
            sprite.scale.x = -1;
            sprite.anchor.x = 1;
        }
        this.addChild(sprite);
        this.updatePosition();
    }

    get firstGunCooldown(): number {
        return this._firstGunCooldown;
    }

    get secondGunCooldown(): number {
        return this._secondGunCooldown;
    }

    get movementPoints(): number {
        return this._movementPoints;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    get path(): game.Direction[] {
        return this._path;
    }

    set path(value: game.Direction[]) {
        this._path = value;
        if (value) {
            this._movementPoints -= value.length;
            this.oldCell = this.cell.clone();
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

    get center(): PIXI.Point {
        return new PIXI.Point(this.x + this.width / 2, this.y + this.height / 2);
    }

    makeCurrent() {
        this._movementPoints = this.hull.speed;
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
        this.emit(Unit.SHOT);
        this.preparedGunId = -1;

        this.projectileService.once(game.Event.DONE, () => target.destroyUnit());
    }

    destroyUnit() {
        this._isDestroyed = true;
        this.alpha = 0.5;
        this.emit(Unit.DESTROY);
    }

    protected update() {
        if (this.path) {
            if (this.path.length > 0) {
                const direction: game.Direction = this.path.pop();
                if (direction == game.Direction.Left) {
                    this.cell.x -= 1;
                } else if (direction == game.Direction.Right) {
                    this.cell.x += 1;
                } else if (direction == game.Direction.Up) {
                    this.cell.y -= 1;
                } else if (direction == game.Direction.Down) {
                    this.cell.y += 1;
                }
                this.updatePosition();
            } else {
                this.path = null;
                this.emit(Unit.MOVE, this.oldCell, this.cell);
            }
        }
    }

    private updatePosition() {
        this.x = this.cell.x * Unit.WIDTH + Field.LINE_WIDTH / 2;
        this.y = this.cell.y * Unit.HEIGHT + Field.LINE_WIDTH / 2;
    }
}
