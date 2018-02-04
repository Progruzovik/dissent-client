import { LogEntry } from "../../util";
import { l } from "../../../localizer";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export default class Log extends druid.AbstractBranch {

    private readonly txtLastEntry = new PIXI.Text("", { fill: "white", fontSize: 18, wordWrap: true });

    constructor(log: LogEntry[]) {
        super();
        this.addChild(this.txtLastEntry);
        if (log.length > 0) {
            const lastEntry = log[log.length - 1];
            this.addEntry(lastEntry.damage, lastEntry.gunName, lastEntry.unitHullName, lastEntry.targetHullName);
        }
    }

    setUpChildren(width: number, height: number): void {
        this.txtLastEntry.style.wordWrapWidth = width;
    }

    addEntry(damage: number, gunName: string, unitHullName: string, targetHullName: string) {
        this.txtLastEntry.text = `${targetHullName} ${l("hitBy")} ${unitHullName} ${l("with")} `
            + `${l(gunName)} ${l("for")} ${damage} ${l("damage")}`;
    }
}
