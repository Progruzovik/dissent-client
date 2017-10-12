import Menu from "./Menu";
import { getStatus, Status } from "../request";
import * as game from "../../game";

export default class MenuScreen extends game.Screen {

    static readonly BATTLE = "battle";

    constructor() {
        super();
        getStatus((status: Status) => {
            const menu = new Menu(status);
            this.frontUi = menu;
            menu.on(game.Event.DONE, () => this.emit(MenuScreen.BATTLE));
        });
    }
}
