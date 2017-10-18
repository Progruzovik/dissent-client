import Menu from "./Menu";
import WebSocketConnection from "../WebSocketConnection";
import { getStatus, Status } from "../request";
import * as game from "../../game";

export default class MenuScreen extends game.Screen {

    static readonly BATTLE = "battle";

    constructor(webSocketConnection: WebSocketConnection) {
        super();
        getStatus((status: Status) => {
            const menu = new Menu(status, webSocketConnection);
            this.frontUi = menu;
            menu.on(game.Event.DONE, () => this.emit(MenuScreen.BATTLE));
        });
    }
}
