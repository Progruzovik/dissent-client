import { Screen } from "./Screen";
import { Event } from "./util";
import * as PIXI from "pixi.js";

export class Application extends PIXI.Application {

    private _currentScreen: Screen;

    constructor() {
        super({ width: innerWidth, height: innerHeight, resolution: devicePixelRatio || 1, autoResize: true });
        onresize = () => {
            this.renderer.resize(innerWidth, innerHeight);
            if (this.currentScreen) {
                this.currentScreen.resize(innerWidth, innerHeight);
            }
        }
    }

    get currentScreen(): Screen {
        return this._currentScreen;
    }

    set currentScreen(value: Screen) {
        this._currentScreen = value;
        if (value) {
            value.resize(innerWidth, innerHeight);
            this.stage.addChild(value);
            value.once(Event.DONE, () => {
                this.currentScreen.destroy({ children: true });
                this.currentScreen = null;
            });
        }
    }
}
