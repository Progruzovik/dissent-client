import * as game from "./";
import * as PIXI from "pixi.js";

export class Application extends PIXI.Application {

    private _root: game.AbstractBranch;

    constructor() {
        super({ resolution: devicePixelRatio || 1, autoResize: true });
    }

    resize(width: number, height: number) {
        this.renderer.resize(width, height);
        if (this.root) {
            this.root.setUpChildren(width, height);
        }
    }

    get root(): game.AbstractBranch {
        return this._root;
    }

    set root(value: game.AbstractBranch) {
        this._root = value;
        if (value) {
            value.setUpChildren(innerWidth, innerHeight);
            this.stage.removeChildren();
            this.stage.addChild(value);

            value.once(game.Event.DONE, () => this.root.destroy({ children: true }));
        }
    }
}
