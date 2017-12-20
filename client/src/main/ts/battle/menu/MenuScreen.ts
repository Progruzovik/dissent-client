import Menu from "./Menu";
import WebSocketClient from "../WebSocketClient";
import * as game from "../../game";

export default class MenuScreen extends game.Screen {

    static readonly BATTLE = "battle";

    constructor(webSocketClient: WebSocketClient) {
        super();
        const menu = new Menu(webSocketClient);
        this.frontUi = menu;
        menu.on(game.Event.DONE, () => this.emit(MenuScreen.BATTLE));
    }
}
