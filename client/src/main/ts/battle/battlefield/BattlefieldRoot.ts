import ActionReceiver from "./ActionReceiver"
import Controls from "./Controls";
import Field from "./Field";
import LeftPanel from "./LeftPanel";
import ProjectileService from "./projectile/ProjectileService";
import PopUp from "./unit/PopUp";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import WebSocketClient from "../WebSocketClient";
import { ActionType, Side } from "../util";
import * as game from "../../game";
import * as PIXI from "pixi.js";

export default class BattlefieldRoot extends game.AbstractRoot {

    private readonly field: Field;
    private readonly controls: Controls;
    private readonly leftUi: LeftPanel;

    private unitPopUp: PopUp;

    constructor(fieldSize: game.Point, playerSide: Side, units: Unit[], asteroids: game.Point[],
                clouds: game.Point[], projectileService: ProjectileService, webSocketClient: WebSocketClient) {
        super();
        const unitService = new UnitService(playerSide, units, webSocketClient);

        this.field = new Field(fieldSize, units, asteroids, clouds, unitService, projectileService, webSocketClient);
        this.addChild(this.field);
        this.controls = new Controls(unitService, webSocketClient);
        this.addChild(this.controls);
        this.leftUi = new LeftPanel(units, unitService);
        this.addChild(this.leftUi);
        unitService.emit(ActionType.NextTurn, true);
        const actionReceiver = new ActionReceiver(this.field, this.controls, unitService, webSocketClient);

        unitService.on(UnitService.UNIT_MOUSE_OVER, (mousePos: PIXI.Point, unit: Unit) => {
            if (this.unitPopUp) {
                this.unitPopUp.destroy({ children: true });
            }
            this.unitPopUp = new PopUp(this.width, this.height, unit);
            this.addChild(this.unitPopUp);
        });
        unitService.on(UnitService.UNIT_MOUSE_OUT, (unit: Unit) => {
            if (this.unitPopUp.unit == unit) {
                this.unitPopUp.destroy({ children: true });
                this.removeChild(this.unitPopUp);
                this.unitPopUp = null;
            }
        });
        actionReceiver.once(ActionType.BattleFinish, () => this.emit(game.Event.DONE));
    }

    onSetUpChildren(width: number, height: number) {
        this.controls.setUpChildren(width, height);
        this.controls.y = height - this.controls.height;
        this.leftUi.setUpChildren(Field.CELL_SIZE.x, this.controls.y);
        this.field.x = this.leftUi.width;
        this.field.setUpChildren(width - this.field.x, this.controls.y);
        if (this.unitPopUp) {
            this.unitPopUp.setUpChildren(width, height);
        }
    }
}
