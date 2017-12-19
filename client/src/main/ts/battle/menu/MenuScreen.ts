import Menu from "./Menu";
import WebSocketClient from "../WebSocketClient";
import * as game from "../../game";

export default class MenuScreen extends game.Screen {

    static readonly BATTLE = "battle";

    private readonly menu: Menu;

    constructor(webSocketClient: WebSocketClient) {
        super();
        this.menu = new Menu(webSocketClient);
        this.frontUi = this.menu;
        this.menu.on(game.Event.DONE, () => this.emit(MenuScreen.BATTLE));
    }
}
