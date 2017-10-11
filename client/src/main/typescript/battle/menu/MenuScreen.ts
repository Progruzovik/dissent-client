import Menu from "./Menu";
import * as game from "../../game";

export default class MenuScreen extends game.Screen {

    static readonly BATTLE = "battle";

    constructor() {
        super();
        const menu = new Menu();
        this.frontUi = menu;
        menu.on(game.Event.DONE, () => this.emit(MenuScreen.BATTLE));
    }
}
