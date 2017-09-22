import Field from "../Field";
import Ship from "./Ship";
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
    private _firstGunCooldown = 0;
    private _secondGunCooldown = 0;
    private _isDestroyed = false;

    private _path: game.Direction[];
    private oldCell: PIXI.Point;

    private _preparedGun: Gun;

    constructor(readonly side: Side, readonly cell: PIXI.Point, readonly ship: Ship, readonly firstGun: Gun,
                readonly secondGun: Gun, private readonly projectileService: ProjectileService) {
        super();
        this.interactive = true;
        const sprite = new PIXI.Sprite(ship.texture);
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
            this.oldCell = this.cell.clone();
        }
    }

    get preparedGun(): Gun {
        return this._preparedGun;
    }

    get center(): PIXI.Point {
        return new PIXI.Point(this.x + this.width / 2, this.y + this.height / 2);
    }

    canHit(target: Unit) {
        return this.preparedGun && this.side != target.side && !target.isDestroyed;
    }

    makeCurrent() {
        this._movementPoints = this.ship.speed;
        if (this.firstGunCooldown > 0) {
            this._firstGunCooldown--;
        }
        if (this.secondGunCooldown > 0) {
            this._secondGunCooldown--;
        }
    }

    makeGunPrepared(gun: Gun) {
        if (gun && this.preparedGun != gun) {
            if (gun == this.firstGun && this.firstGunCooldown == 0
                || gun == this.secondGun && this.secondGunCooldown == 0) {
                this._preparedGun = gun;
                this.emit(Unit.PREPARED_TO_SHOT);
            }
        } else {
            this._preparedGun = null;
            this.emit(Unit.NOT_PREPARED_TO_SHOT);
        }
    }

    shoot(target: Unit) {
        this.projectileService.shoot(this.preparedGun, target.center, this.center);
        if (this.preparedGun == this.firstGun) {
            this._firstGunCooldown = this.preparedGun.cooldown;
        } else if (this.preparedGun == this.secondGun) {
            this._secondGunCooldown = this.preparedGun.cooldown;
        }
        this.emit(Unit.SHOT);
        this.makeGunPrepared(null);

        this.projectileService.once(game.Event.DONE, () => target.destroyShip());
    }

    destroyShip() {
        this._isDestroyed = true;
        this.alpha = 0.5;
        this.emit(Unit.DESTROY);
    }

    protected update() {
        if (this.path) {
            if (this.path.length > 0 && this.movementPoints > 0) {
                this._movementPoints--;
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
