import { LogEntry, Side } from "../../../model/util";
import { l } from "../../../localizer";
import * as css  from "../../../../css/battle.css";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class Log extends druid.AbstractBranch {

    private _isExpanded = false;

    private readonly divLogContainer: HTMLDivElement = document.createElement("div");
    private readonly divLog: HTMLDivElement = document.createElement("div");

    private readonly bg = new druid.Rectangle();
    private readonly txtLastEntry = new PIXI.Text("", { fontSize: 15, wordWrap: true });
    private readonly btnTurnLog = new druid.Button();

    constructor(private readonly playerSide: Side, log: LogEntry[]) {
        super();
        this.interactive = true;
        this.visible = false;

        this.divLogContainer.className = css.logContainer;
        this.divLog.className = css.log;
        this.divLogContainer.appendChild(this.divLog);

        this.bg.alpha = 0.75;
        this.addChild(this.bg);
        this.btnTurnLog.pivot.y = this.btnTurnLog.height;
        this.addChild(this.btnTurnLog);
        for (const entry of log) {
            this.addEntry(entry);
        }
        this.updateChildren();

        this.btnTurnLog.on(druid.Button.TRIGGERED, () => {
            this._isExpanded = !this.isExpanded;
            this.updateChildren();
        });
        this.on(druid.Event.ADDED, () => document.body.insertBefore(this.divLogContainer, document.body.firstChild));
        this.on(druid.Event.REMOVED, () => document.body.removeChild(this.divLogContainer));
    }

    get isExpanded(): boolean {
        return this._isExpanded;
    }

    setUpChildren(width: number, height: number): void {
        this.btnTurnLog.y = height - druid.INDENT;
        const freeHeight: number = this.btnTurnLog.y - this.btnTurnLog.height;
        this.divLogContainer.style.width = `${width}px`;
        this.divLogContainer.style.height = `${freeHeight}px`;
        this.divLogContainer.style.left = `${this.x}px`;
        this.txtLastEntry.style.wordWrapWidth = width;
        this.txtLastEntry.y = freeHeight;
        this.updateBg();
    }

    addEntry(entry: LogEntry) {
        this.visible = true;
        const color = this.playerSide == entry.side ? "green" : "red";
        let text = `${entry.targetHullName} ${l("hitBy")} ${entry.unitHullName} `
            + `${l("with")} ${l(entry.gunName)} ${l("for")} ${entry.damage} ${l("damage")}`;
        if (entry.isTargetDestroyed) {
            text += `\n${entry.targetHullName} ${l("destroyed")}`;
        }

        const pEntry = document.createElement("p");
        pEntry.className = css.logEntry;
        pEntry.style.color = color;
        pEntry.innerText = text;
        this.divLog.appendChild(pEntry);

        this.txtLastEntry.style.fill = color;
        this.txtLastEntry.text = text;
        this.txtLastEntry.anchor.y = 1;
        this.updateBg();
    }

    private updateBg() {
        this.bg.width = this.width;
        this.bg.height = this.txtLastEntry.height + this.btnTurnLog.height + druid.INDENT;
        if (this.isExpanded) {
            this.bg.height += this.divLogContainer.offsetHeight;
            this.bg.y = 0;
        } else {
            this.bg.y = this.txtLastEntry.y - this.txtLastEntry.height;
        }
    }

    private updateChildren() {
        if (this.isExpanded) {
            this.divLogContainer.style.display = "block";
            this.divLog.scrollTo(0, this.divLog.scrollHeight);
            this.removeChild(this.txtLastEntry);
            this.btnTurnLog.text = "⇓";
        } else {
            this.divLogContainer.style.display = "none";
            this.addChild(this.txtLastEntry);
            this.btnTurnLog.text = "⇑";
        }
        this.updateBg();
    }
}
