import Menu from "./Menu";
import WebSocketConnection from "../WebSocketConnection";
import * as game from "../../game";

export default class MenuScreen extends game.Screen {

    static readonly BATTLE = "battle";

    constructor(webSocketConnection: WebSocketConnection) {
        super();
        const menu = new Menu(webSocketConnection);
        this.frontUi = menu;
        menu.on(game.Event.DONE, () => this.emit(MenuScreen.BATTLE));
    }
}
