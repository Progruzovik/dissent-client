import Menu from "./Menu";
import WebSocketClient from "../WebSocketClient";
import * as game from "../../game";

export default class MenuScreen extends game.Screen {

    static readonly BATTLE = "battle";

    constructor(webSocketClient: WebSocketClient) {
        super();
        webSocketClient.requestShips(sd => {
            const menu = new Menu(sd, webSocketClient);
            this.frontUi = menu;
            menu.on(game.Event.DONE, () => this.emit(MenuScreen.BATTLE));
        });
    }
}
