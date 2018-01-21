import Field from "../ui/Field";
import ProjectileService from "../projectile/ProjectileService";
import Ship from "../../Ship";
import { ActionType, Gun, Hull, Move, Shot, Side } from "../../util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class Unit extends druid.AbstractActor {

    static readonly ALPHA_DESTROYED = 0.5;
    static readonly NO_GUN_ID = -1;

    static readonly UPDATE_STATS = "updateStats";
    static readonly PREPARE_TO_SHOT = "prepareToShot";
    static readonly NOT_PREPARE_TO_SHOT = "notPrepareToShot";
    static readonly DESTROY = "destroy";

    readonly frameColor: number;

    private _preparedGunId: number = Unit.NO_GUN_ID;
    private _currentMove: Move;

    constructor(private _actionPoints: number, playerSide: Side, readonly side: Side, private _cell: druid.Point,
                readonly ship: Ship, private readonly projectileService?: ProjectileService) {
        super();
        this.interactive = true;
        this.frameColor = playerSide == this.side ? 0x00ff00 : 0xff0000;

        const sprite = ship.createSprite();
        if (side == Side.Right) {
            sprite.scale.x = -1;
            sprite.anchor.x = 1;
        }
        this.addChild(sprite);
        const frameWidth = ship.hull.width * Field.CELL_SIZE.x, frameHeight = ship.hull.height * Field.CELL_SIZE.y;
        this.addChild(new druid.Frame(frameWidth, frameHeight, 0.6, this.frameColor));
        this.updatePosition();
    }

    get actionPoints(): number {
        return this._actionPoints;
    }

    get strength(): number {
        return this.ship.strength;
    }

    set strength(value: number) {
        this.ship.strength = value;
        if (this.ship.strength == 0) {
            this.alpha = Unit.ALPHA_DESTROYED;
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
        if (this.preparedGunId == value || value == Unit.NO_GUN_ID) {
            this._preparedGunId = Unit.NO_GUN_ID;
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
        this.preparedGunId = Unit.NO_GUN_ID;
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
            this.preparedGunId = Unit.NO_GUN_ID;
            target.strength -= shot.damage;
            target.emit(Unit.UPDATE_STATS);
            this.emit(ActionType.Shot, activeGun, target, shot.damage);
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
}
