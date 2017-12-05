import { Screen } from "./Screen";
import { Event } from "./util";
import * as PIXI from "pixi.js";

export class Application extends PIXI.Application {

    private _currentScreen: Screen;

    constructor() {
        super({ resolution: devicePixelRatio || 1, autoResize: true });
    }

    resize() {
        this.renderer.resize(window.innerWidth, window.innerHeight);
        if (this.currentScreen) {
            this.currentScreen.resize(window.innerWidth, window.innerHeight);
        }
    }

    get currentScreen(): Screen {
        return this._currentScreen;
    }

    set currentScreen(value: Screen) {
        this._currentScreen = value;
        if (value) {
            value.resize(innerWidth, innerHeight);
            this.stage.removeChildren();
            this.stage.addChild(value);

            value.once(Event.DONE, () => this.currentScreen.destroy({ children: true }));
        }
    }
}
