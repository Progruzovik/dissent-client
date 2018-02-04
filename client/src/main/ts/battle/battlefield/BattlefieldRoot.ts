import ActionReceiver from "./ActionReceiver"
import Controls from "./ui/Controls";
import Field from "./ui/Field";
import LeftPanel from "./ui/LeftPanel";
import ProjectileService from "./projectile/ProjectileService";
import PopUp from "./ui/PopUp";
import Unit from "./unit/Unit";
import UnitService from "./unit/UnitService";
import WebSocketClient from "../WebSocketClient";
import { ActionType, LogEntry, Side } from "../util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class BattlefieldRoot extends druid.AbstractBranch {

    private contentWidth = 0;
    private contentHeight = 0;

    private readonly field: Field;
    private readonly leftPanel: LeftPanel;
    private readonly controls: Controls;

    private unitPopUp: PopUp;

    constructor(fieldSize: druid.Point, playerSide: Side, log: LogEntry[], units: Unit[], asteroids: druid.Point[],
                clouds: druid.Point[], projectileService: ProjectileService, webSocketClient: WebSocketClient) {
        super();
        const unitService = new UnitService(playerSide, units, webSocketClient);

        this.field = new Field(fieldSize, units, asteroids, clouds, unitService, projectileService, webSocketClient);
        this.addChild(this.field);
        this.leftPanel = new LeftPanel(units, unitService);
        this.addChild(this.leftPanel);
        this.controls = new Controls(log, unitService, webSocketClient);
        this.addChild(this.controls);
        unitService.emit(ActionType.NextTurn);
        const actionReceiver = new ActionReceiver(this.field, this.controls, unitService, webSocketClient);

        unitService.on(UnitService.UNIT_MOUSE_OVER, (mousePos: PIXI.Point, unit: Unit) => {
            if (this.unitPopUp) {
                this.unitPopUp.destroy({ children: true });
            }
            this.unitPopUp = new PopUp(this.contentWidth, this.contentHeight, unit);
            this.addChild(this.unitPopUp);
        });
        unitService.on(UnitService.UNIT_MOUSE_OUT, (unit: Unit) => {
            if (this.unitPopUp && this.unitPopUp.unit == unit) {
                this.unitPopUp.destroy({ children: true });
                this.removeChild(this.unitPopUp);
                this.unitPopUp = null;
            }
        });
        this.field.on(druid.Event.MOUSE_DOWN, () => {
            if (this.unitPopUp) {
                this.unitPopUp.destroy({ children: true });
                this.unitPopUp = null;
            }
        });
        actionReceiver.once(ActionType.BattleFinish, () => this.emit(druid.Event.DONE));
    }

    setUpChildren(width: number, height: number) {
        this.controls.setUpChildren(width, height);
        this.contentWidth = width;
        this.contentHeight = height - this.controls.buttonsHeight;

        this.leftPanel.setUpChildren(Field.CELL_SIZE.x, this.contentHeight);
        this.field.x = this.leftPanel.width;
        this.field.setUpChildren(width - this.field.x, height - this.controls.fullBottomHeight);
        if (this.unitPopUp) {
            this.unitPopUp.setUpChildren(this.contentWidth, this.contentHeight);
        }
    }
}
