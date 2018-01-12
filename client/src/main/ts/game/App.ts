import { AbstractBranch, Event } from "./";
import * as PIXI from "pixi.js";

export class App {

    private _root: AbstractBranch;
    private readonly application: PIXI.Application;

    constructor(resolution: number, private width: number, private height: number) {
        const appOptions = { autoResize: true, resolution: resolution, sharedLoader: true, sharedTicker: true };
        this.application = new PIXI.Application(appOptions);
        this.resize(width, height);
    }

    get root(): AbstractBranch {
        return this._root;
    }

    set root(value: AbstractBranch) {
        this.application.stage.removeChild(this.root);
        this._root = value;
        if (value) {
            value.setUpChildren(this.width, this.height);
            this.application.stage.addChild(value);

            value.once(Event.DONE, () => this.root.destroy({ children: true }));
        }
    }

    get view(): HTMLCanvasElement {
        return this.application.view;
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.application.renderer.resize(width, height);
        if (this.root) {
            this.root.setUpChildren(width, height);
        }
    }
}
