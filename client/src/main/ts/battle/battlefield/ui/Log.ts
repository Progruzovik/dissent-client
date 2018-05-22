import { LogEntry } from "../../../model/util";
import { l } from "../../../localizer";
import * as css  from "../../../../css/battle.css";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class Log extends druid.AbstractBranch {

    private isLogExpanded = false;

    private readonly divLog: HTMLDivElement = document.createElement("div");
    private readonly bg = new druid.Rectangle();
    private readonly txtLastEntry = new PIXI.Text("", { fill: "white", fontSize: 18, wordWrap: true });
    private readonly btnTurnLog = new druid.Button();

    constructor(log: LogEntry[]) {
        super();
        this.interactive = true;
        this.divLog.className = css.log;
        this.bg.alpha = 0.75;
        this.addChild(this.bg);
        this.btnTurnLog.pivot.y = this.btnTurnLog.height;
        this.addChild(this.btnTurnLog);
        for (const entry of log) {
            this.addEntry(entry.damage, entry.gunName, entry.unitHullName, entry.targetHullName);
        }
        this.updateChildren();

        this.btnTurnLog.on(druid.Button.TRIGGERED, () => {
            this.isLogExpanded = !this.isLogExpanded;
            this.updateChildren();
        });
        this.on(druid.Event.ADDED, () => document.body.insertBefore(this.divLog, document.body.firstChild));
        this.on(druid.Event.REMOVED, () => document.body.removeChild(this.divLog));
    }

    setUpChildren(width: number, height: number): void {
        this.btnTurnLog.y = height - druid.INDENT;
        const freeHeight: number = this.btnTurnLog.y - this.btnTurnLog.height;
        this.divLog.style.width = `${width}px`;
        this.divLog.style.height = `${freeHeight}px`;
        this.divLog.style.left = `${this.x}px`;
        this.txtLastEntry.style.wordWrapWidth = width;
        this.txtLastEntry.y = freeHeight;
        this.updateBg();
    }

    addEntry(damage: number, gunName: string, unitHullName: string, targetHullName: string) {
        const text = `${targetHullName} ${l("hitBy")} ${unitHullName} `
            + `${l("with")} ${l(gunName)} ${l("for")} ${damage} ${l("damage")}`;
        this.divLog.innerText += `${text}\n\n`;
        this.txtLastEntry.text = text;
        this.txtLastEntry.anchor.y = 1;
        this.updateBg();
    }

    private updateBg() {
        this.bg.width = this.width;
        this.bg.height = this.txtLastEntry.height + this.btnTurnLog.height + druid.INDENT;
        if (this.isLogExpanded) {
            this.bg.height += this.divLog.offsetHeight;
            this.bg.y = 0;
        } else {
            this.bg.y = this.txtLastEntry.y - this.txtLastEntry.height;
        }
    }

    private updateChildren() {
        if (this.isLogExpanded) {
            this.divLog.scrollTo(0, this.divLog.scrollHeight);
            this.divLog.style.display = "block";
            this.removeChild(this.txtLastEntry);
            this.btnTurnLog.text = "⇓";
        } else {
            this.divLog.style.display = "none";
            this.addChild(this.txtLastEntry);
            this.btnTurnLog.text = "⇑";
        }
        this.updateBg();
    }
}
