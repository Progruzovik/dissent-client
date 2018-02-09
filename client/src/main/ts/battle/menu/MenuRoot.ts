import Hangar from "./hangar/Hangar";
import Controls from "./Controls";
import MissionBranch from "./MissionBranch";
import PvpBranch from "./PvpBranch";
import WebSocketClient from "../../WebSocketClient";
import { Status } from "../../model/util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class MenuRoot extends druid.AbstractBranch {

    private readonly hangar = new Hangar();
    private readonly missionBranch = new MissionBranch(this.webSocketClient);
    private readonly pvpBranch = new PvpBranch(this.webSocketClient);
    private _currentBranch: druid.AbstractBranch;

    private readonly controls = new Controls();

    constructor(private readonly webSocketClient: WebSocketClient) {
        super();
        webSocketClient.requestMissions(m => this.missionBranch.updateMissions(m));

        const txtTitle = new PIXI.Text("Dissent <tech demo>", { fontSize: 14, fontStyle: "italic" });
        this.addChild(new druid.Rectangle(txtTitle.width + druid.INDENT, 16, 0xdedede));
        txtTitle.x = druid.INDENT / 2;
        this.addChild(txtTitle);
        this.currentBranch = this.hangar;
        this.addChild(this.controls);

        webSocketClient.on(WebSocketClient.STATUS, (status: Status) => {
            this.pvpBranch.status = status;
            if (status == Status.Idle) {
                this.controls.isEnabled = true;
            } else if (status == Status.Queued) {
                this.currentBranch = this.pvpBranch;
                this.controls.isEnabled = false;
            } else if (status == Status.InBattle) {
                this.emit(Hangar.BATTLE);
            }
        });
        this.hangar.on(Hangar.BATTLE, () => this.emit(Hangar.BATTLE));
        this.controls.on(Controls.HANGAR, () => {
            this.hangar.reset();
            this.currentBranch = this.hangar;
        });
        this.controls.on(Controls.MISSIONS, () => this.currentBranch = this.missionBranch);
        this.controls.on(Controls.PVP, () => this.currentBranch = this.pvpBranch);

        this.updateInfo();
    }

    updateInfo() {
        this.webSocketClient.updateStatus();
        this.webSocketClient.requestShips(sd => this.hangar.updateShipsData(sd));
    }

    setUpChildren(width: number, height: number) {
        this.controls.setUpChildren(width, height);
        this.controls.pivot.y = this.controls.height;
        this.controls.y = height;

        const freeHeight = height - this.controls.height;
        this.hangar.setUpChildren(width, freeHeight);
        this.missionBranch.setUpChildren(width, freeHeight);
        this.pvpBranch.setUpChildren(width, freeHeight);
    }

    private get currentBranch(): druid.AbstractBranch {
        return this._currentBranch;
    }

    private set currentBranch(value: druid.AbstractBranch) {
        if (this.currentBranch) {
            this.removeChild(this.currentBranch);
        }
        this._currentBranch = value;
        if (value) {
            this.addChild(value);
        }
    }
}
