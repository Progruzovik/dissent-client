import ScalableVerticalLayout from "../ui/ScalableVerticalLayout";
import { l } from "../../localizer"
import * as druid from "pixi-druid";

export default class Controls extends ScalableVerticalLayout {

    static readonly HANGAR = "hangar";
    static readonly MISSIONS = "missions";
    static readonly PVP = "pvp";

    private readonly buttonGroup: druid.ButtonGroup;

    constructor() {
        super(6, 15);
        const buttons: druid.Button[] = [
            new druid.Button(l("hangar")),
            new druid.Button(l("missions")),
            new druid.Button(l("pvp"))
        ];
        this.buttonGroup = new druid.ButtonGroup(buttons);
        for (const button of buttons) {
            this.addElement(button);
        }

        this.buttonGroup.on(druid.Button.TRIGGERED, (i: number) => {
            if (i == 0) {
                this.emit(Controls.HANGAR);
            } else if (i == 1) {
                this.emit(Controls.MISSIONS);
            } else if (i == 2) {
                this.emit(Controls.PVP);
            }
        });
    }

    get isEnabled(): boolean {
        return this.buttonGroup.isEnabled;
    }

    set isEnabled(value: boolean) {
        this.buttonGroup.isEnabled = value;
    }
}
