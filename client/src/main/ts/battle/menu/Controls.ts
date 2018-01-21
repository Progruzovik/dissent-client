import ScalableVerticalLayout from "../ui/ScalableVerticalLayout";
import { l } from "../../localizer"
import * as druid from "pixi-druid";

export default class Controls extends ScalableVerticalLayout {

    static readonly HANGAR = "hangar";
    static readonly MISSIONS = "missions";
    static readonly PVP = "pvp";

    constructor() {
        super(6, 15);
        const btnHangar = new druid.Button(l("hangar"));
        this.addElement(btnHangar);
        const btnMissions = new druid.Button(l("missions"));
        this.addElement(btnMissions);
        const btnPvp = new druid.Button(l("pvp"));
        this.addElement(btnPvp);

        btnHangar.on(druid.Button.TRIGGERED, () => this.emit(Controls.HANGAR));
        btnMissions.on(druid.Button.TRIGGERED, () => this.emit(Controls.MISSIONS));
        btnPvp.on(druid.Button.TRIGGERED, () => this.emit(Controls.PVP));
    }
}
