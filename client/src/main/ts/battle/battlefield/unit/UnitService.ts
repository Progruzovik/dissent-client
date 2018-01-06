import Unit from "./Unit";
import WebSocketClient from "../../WebSocketClient";
import { ActionType, Side } from "../../util";
import * as game from "../../../game";
import * as PIXI from "pixi.js";

export default class UnitService extends PIXI.utils.EventEmitter {

    static readonly UNIT_MOUSE_OVER = "unitMouseOver";
    static readonly UNIT_MOUSE_OUT = "unitMouseOut";
    static readonly SHOT_CELL = "shotCell";
    static readonly TARGET_CELL = "targetCell";

    readonly unitQueue = new Array<Unit>(0);
    private readonly currentTargets = new Array<Unit>(0);

    constructor(private readonly playerSide: Side, units: Unit[],
                private readonly webSocketClient: WebSocketClient) {
        super();
        for (const unit of units) {
            if (unit.strength > 0) {
                this.unitQueue.push(unit);
                unit.on(game.Event.CLICK, () => {
                    if (this.currentTargets.indexOf(unit) != -1) {
                        webSocketClient.shootWithCurrentUnit(this.currentUnit.preparedGunId, unit.cell);
                    }
                });
                unit.on(ActionType.Move, () => {
                    this.emit(ActionType.Move);
                    this.checkCurrentUnitActionPoints();
                });
                unit.on(ActionType.Shot, () => {
                    this.emit(ActionType.Shot);
                    this.checkCurrentUnitActionPoints();
                });
                unit.on(Unit.PREPARE_TO_SHOT, () => {
                    webSocketClient.requestGunCells(unit.preparedGunId, g => {
                        this.emit(Unit.PREPARE_TO_SHOT);
                        for (const cell of g.shotCells) {
                            this.emit(UnitService.SHOT_CELL, cell);
                        }
                        for (const cell of g.targetCells) {
                            this.currentTargets.push(this.unitQueue
                                .filter(u => u.cell.x == cell.x && u.cell.y == cell.y)[0]);
                            this.emit(UnitService.TARGET_CELL, cell);
                        }
                    });
                });
                unit.on(Unit.NOT_PREPARE_TO_SHOT, () => {
                    this.currentTargets.length = 0;
                    this.emit(Unit.NOT_PREPARE_TO_SHOT);
                });
                unit.once(Unit.DESTROY, () => {
                    this.unitQueue.splice(this.unitQueue.indexOf(unit), 1);
                    unit.off(game.Event.CLICK);
                    unit.off(ActionType.Move);
                    unit.off(ActionType.Shot);
                    unit.off(Unit.PREPARE_TO_SHOT);
                    unit.off(Unit.NOT_PREPARE_TO_SHOT);
                });
            }

            unit.on(game.Event.MOUSE_OVER, (e: PIXI.interaction.InteractionEvent) => {
                if (this.currentUnit.preparedGunId != Unit.NO_GUN_ID
                    && this.currentUnit.side != unit.side && unit.strength > 0) {
                    unit.alpha = 0.75;
                }
                this.emit(UnitService.UNIT_MOUSE_OVER, e.data.global, unit);
            });
            unit.on(game.Event.MOUSE_OUT, () => {
                if (unit.strength > 0) {
                    unit.alpha = 1;
                }
                this.emit(UnitService.UNIT_MOUSE_OUT, unit);
            });
        }
    }

    get isCurrentPlayerTurn(): boolean {
        return this.playerSide == this.currentUnit.side;
    }

    get currentUnit(): Unit {
        return this.unitQueue[0];
    }

    nextTurn() {
        this.currentUnit.preparedGunId = Unit.NO_GUN_ID;
        this.unitQueue.push(this.unitQueue.shift());
        this.currentUnit.makeCurrent();
        this.emit(ActionType.NextTurn, false);
    }

    private checkCurrentUnitActionPoints() {
        if (this.isCurrentPlayerTurn && this.currentUnit.actionPoints == 0) {
            this.webSocketClient.endTurn();
        }
    }
}
