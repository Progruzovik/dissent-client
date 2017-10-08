import { postScenario } from "../request";
import * as game from "../../game";

export default class MenuScreen extends game.Screen {

    constructor() {
        super();
        const btnStart = new game.Button("Поехали!");
        btnStart.position.set(20, 20);
        this.addChild(btnStart);

        btnStart.on(game.Event.BUTTON_CLICK, () => {
            postScenario(() => this.emit(game.Event.DONE));
        });
    }
}
