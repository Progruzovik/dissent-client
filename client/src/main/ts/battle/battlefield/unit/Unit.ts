import Field from "../Field";
import ProjectileService from "../projectile/ProjectileService";
import Ship from "../../ship/Ship";
import { ActionType, Gun, Hull, Move, Shot, Side } from "../../util";
import * as game from "../../../game";
import * as PIXI from "pixi.js";

export default class Unit extends game.AbstractActor {

    static readonly ALPHA_DESTROYED = 0.5;
    static readonly NO_GUN_ID = -1;

    static readonly UPDATE_STATS = "updateStats";
    static readonly PREPARE_TO_SHOT = "prepareToShot";
    static readonly NOT_PREPARE_TO_SHOT = "notPrepareToShot";
    static readonly DESTROY = "destroy";

    readonly frameColor: number;

    private _preparedGunId = Unit.NO_GUN_ID;
    private _currentMove: Move;

    constructor(private _actionPoints: number, playerSide: Side, readonly side: Side, private _cell: game.Point,
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
        this.addChild(new game.Frame(frameWidth, frameHeight, 0.6, this.frameColor));
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
        if (this.preparedGunId == value) {
            this._preparedGunId = Unit.NO_GUN_ID;
            this.emit(Unit.NOT_PREPARE_TO_SHOT);
        } else if (value == this.ship.firstGun.id || value == this.ship.secondGun.id) {
            this._preparedGunId = value;
            this.emit(Unit.PREPARE_TO_SHOT);
        }
    }

    get center(): game.Point {
        return new game.Point(this.x + this.width / 2, this.y + this.height / 2);
    }

    makeCurrent() {
        this._actionPoints = this.ship.hull.actionPoints;
    }

    shoot(target: Unit, shot: Shot) {
        let activeGun: Gun = null;
        if (shot.gunId == this.ship.firstGun.id) {
            activeGun = this.ship.firstGun;
        } else if (shot.gunId == this.ship.secondGun.id) {
            activeGun = this.ship.secondGun;
        }
        this._actionPoints -= activeGun.shotCost;
        this.projectileService.shoot(activeGun, this.center, target.center);

        this.projectileService.once(game.Event.DONE, () => {
            this._preparedGunId = Unit.NO_GUN_ID;
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
        this.x = this.cell.x * Field.CELL_SIZE.x + Field.LINE_WIDTH / 2;
        this.y = this.cell.y * Field.CELL_SIZE.y + Field.LINE_WIDTH / 2;
    }
}
