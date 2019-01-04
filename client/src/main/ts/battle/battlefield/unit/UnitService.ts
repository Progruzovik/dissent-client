import { Unit } from "./Unit";
import { WebSocketClient } from "../../../WebSocketClient";
import { MessageSubject, Gun, Side, Target } from "../../../model/util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class UnitService extends PIXI.utils.EventEmitter {

    static readonly UNIT_MOUSE_OVER = "unitMouseOver";
    static readonly UNIT_MOUSE_OUT = "unitMouseOut";
    static readonly SHOT_CELL = "shotCell";
    static readonly TARGET_CELL = "targetCell";

    private readonly unitQueue: Unit[] = [];
    private readonly targets: Target[] = [];

    constructor(private readonly playerSide: Side, units: Unit[],
                private readonly webSocketClient: WebSocketClient) {
        super();
        for (const unit of units) {
            if (unit.strength > 0) {
                this.unitQueue.push(unit);
                unit.on(druid.Event.CLICK, () => {
                    const target: Target = this.findTargetForUnit(unit);
                    if (target) {
                        const gunId: number = this.activeUnit.preparedGunId;
                        webSocketClient.shootWithCurrentUnit(gunId, target.cell);
                    }
                });
                unit.on(MessageSubject.Move, () => {
                    this.emit(MessageSubject.Move);
                    this.tryToEndTurn();
                });
                unit.on(MessageSubject.Shot, (damage: number, gun: Gun, target: Unit) => {
                    this.emit(MessageSubject.Shot, damage, gun, unit, target);
                    this.tryToEndTurn();
                });
                unit.on(Unit.PREPARE_TO_SHOT, () => {
                    webSocketClient.requestGunCells(unit.preparedGunId).then(g => {
                        this.emit(Unit.PREPARE_TO_SHOT);
                        for (const cell of g.shotCells) {
                            this.emit(UnitService.SHOT_CELL, cell);
                        }
                        this.targets.length = 0;
                        this.targets.push(...g.targets);
                        for (const target of this.targets) {
                            this.emit(UnitService.TARGET_CELL, target.cell);
                        }
                    });
                });
                unit.on(Unit.NOT_PREPARE_TO_SHOT, () => {
                    this.targets.length = 0;
                    this.emit(Unit.NOT_PREPARE_TO_SHOT);
                });
                unit.once(Unit.DESTROY, () => {
                    this.unitQueue.splice(this.unitQueue.indexOf(unit), 1);
                    unit.off(druid.Event.CLICK);
                    unit.off(MessageSubject.Move);
                    unit.off(MessageSubject.Shot);
                    unit.off(Unit.PREPARE_TO_SHOT);
                    unit.off(Unit.NOT_PREPARE_TO_SHOT);
                });
            }

            unit.on(druid.Event.MOUSE_OVER, (e: PIXI.interaction.InteractionEvent) => {
                const target: Target = this.findTargetForUnit(unit);
                if (target) {
                    unit.alpha = 0.75;
                }
                this.emit(UnitService.UNIT_MOUSE_OVER, e.data.global, unit, target ? target.hittingChance : null);
            });
            unit.on(druid.Event.MOUSE_OUT, () => {
                unit.alpha = 1;
                this.emit(UnitService.UNIT_MOUSE_OUT, unit);
            });
        }
    }

    get isCurrentPlayerTurn(): boolean {
        return this.playerSide == this.activeUnit.side;
    }

    get activeUnit(): Unit {
        return this.unitQueue[0];
    }

    findUnitOnCell(cell: druid.Point) {
        return this.unitQueue.filter(u => u.isOccupyCell(cell))[0];
    }

    nextTurn() {
        this.unitQueue.push(this.unitQueue.shift());
        this.activeUnit.activate();
        this.emit(MessageSubject.NextTurn);
    }

    private findTargetForUnit(unit: Unit): Target {
        return this.targets.filter(t => t.cell.x == unit.cell.x && t.cell.y == unit.cell.y)[0];
    }

    private tryToEndTurn() {
        if (this.isCurrentPlayerTurn && this.activeUnit.actionPoints == 0) {
            this.webSocketClient.endTurn();
        }
    }
}
