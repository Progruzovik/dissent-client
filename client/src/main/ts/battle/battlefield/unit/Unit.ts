import { Field } from "../ui/Field";
import { ProjectileService } from "../projectile/ProjectileService";
import { Ship } from "../../../model/Ship";
import { ActionType, Gun, Move, Shot, Side } from "../../../model/util";
import * as druid from "pixi-druid";

export class Unit extends druid.AbstractActor {

    static readonly NO_GUN = -1;

    static readonly UPDATE_STATS = "updateStats";
    static readonly PREPARE_TO_SHOT = "prepareToShot";
    static readonly NOT_PREPARE_TO_SHOT = "notPrepareToShot";
    static readonly DESTROY = "destroy";

    private isMouseOver = false;

    private _preparedGunId: number = Unit.NO_GUN;
    private _currentMove: Move;
    private sprite: PIXI.Sprite;
    readonly frame: druid.Frame;

    constructor(private _actionPoints: number, playerSide: Side, readonly side: Side, private _cell: druid.Point,
                readonly ship: Ship, private readonly projectileService?: ProjectileService) {
        super();
        this.interactive = true;
        this.updatePosition();
        this.updateSprite();
        const frameWidth = ship.hull.width * Field.CELL_SIZE.x, frameHeight = ship.hull.height * Field.CELL_SIZE.y;
        this.frame = new druid.Frame(frameWidth, frameHeight, playerSide == this.side ? 0x00ff00 : 0xff0000, 0.75);
        this.addChild(this.frame);

        this.on(druid.Event.MOUSE_OVER, () => {
            this.isMouseOver = true;
            if (this.isDestroyed) {
                this.addChild(this.frame);
            }
        });
        this.on(druid.Event.MOUSE_OUT, () => {
            this.isMouseOver = false;
            if (this.isDestroyed) {
                this.removeChild(this.frame);
            }
        });
    }

    get isDestroyed(): boolean {
        return this.strength == 0;
    }

    get actionPoints(): number {
        return this._actionPoints;
    }

    get strength(): number {
        return this.ship.strength;
    }

    set strength(value: number) {
        this.ship.strength = value;
        if (this.isDestroyed) {
            if (!this.isMouseOver) {
                this.removeChild(this.frame);
            }
            this.updateSprite();
            this.emit(Unit.DESTROY);
        }
    }

    get cell(): druid.Point {
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
        if (value == Unit.NO_GUN) {
            this._preparedGunId = Unit.NO_GUN;
            this.emit(Unit.NOT_PREPARE_TO_SHOT);
        } else if (value == this.ship.firstGun.id || value == this.ship.secondGun.id) {
            this._preparedGunId = value;
            this.emit(Unit.PREPARE_TO_SHOT);
        }
    }

    isOccupyCell(cell: druid.Point): boolean {
        return cell.x >= this.cell.x && cell.x < this.cell.x + this.ship.hull.width
            && cell.y >= this.cell.y && cell.y < this.cell.y + this.ship.hull.height;
    }

    findCenterCell(): druid.Point {
        return new druid.Point((this.ship.hull.width - 1) / 2, (this.ship.hull.height - 1) / 2);
    }

    findCenter(): druid.Point {
        return new druid.Point(this.x + this.width / 2, this.y + this.height / 2);
    }

    activate() {
        this._actionPoints = this.ship.hull.actionPoints;
        this.preparedGunId = Unit.NO_GUN;
    }

    shoot(target: Unit, shot: Shot) {
        let activeGun: Gun = null;
        if (shot.gunId == this.ship.firstGun.id) {
            activeGun = this.ship.firstGun;
        } else if (shot.gunId == this.ship.secondGun.id) {
            activeGun = this.ship.secondGun;
        }
        this._actionPoints -= activeGun.shotCost;
        this.projectileService.shoot(activeGun, this.findCenter(), target.findCenter());

        this.projectileService.once(druid.Event.DONE, () => {
            this.preparedGunId = Unit.NO_GUN;
            target.strength -= shot.damage;
            target.emit(Unit.UPDATE_STATS);
            this.emit(ActionType.Shot, shot.damage, activeGun, target);
        });
    }

    protected update(deltaTime: number) {
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
        this.x = this.cell.x * Field.CELL_SIZE.x + Field.LINE_WIDTH / 2;
        this.y = this.cell.y * Field.CELL_SIZE.y + Field.LINE_WIDTH / 2;
    }

    private updateSprite() {
        if (this.sprite) {
            this.removeChild(this.sprite);
        }
        this.sprite = this.ship.createSprite();
        if (this.side == Side.Right) {
            this.sprite.scale.x = -1;
            this.sprite.anchor.x = 1;
        }
        this.addChildAt(this.sprite, 0);
    }
}
