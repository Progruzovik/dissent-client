import ScalableVerticalLayout from "../ui/ScalableVerticalLayout";
import { l } from "../../localizer"
import * as druid from "pixi-druid";

export default class Controls extends ScalableVerticalLayout {

    static readonly HANGAR = "hangar";
    static readonly MISSIONS = "missions";
    static readonly PVP = "pvp";

    private readonly btnHangar = new druid.Button(l("hangar"));
    private readonly btnMissions = new druid.Button(l("missions"));
    private readonly btnPvp = new druid.Button(l("pvp"));

    constructor() {
        super(6, 15);
        this.addElement(this.btnHangar);
        this.addElement(this.btnMissions);
        this.addElement(this.btnPvp);

        this.btnHangar.on(druid.Button.TRIGGERED, () => this.emit(Controls.HANGAR));
        this.btnMissions.on(druid.Button.TRIGGERED, () => this.emit(Controls.MISSIONS));
        this.btnPvp.on(druid.Button.TRIGGERED, () => this.emit(Controls.PVP));
    }

    lockButtons(isLocked: boolean) {
        this.btnHangar.isEnabled = !isLocked;
        this.btnMissions.isEnabled = !isLocked;
        this.btnPvp.isEnabled = !isLocked;
    }
}
