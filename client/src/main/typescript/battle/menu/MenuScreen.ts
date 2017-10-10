import Menu from "./Menu";
import * as game from "../../game";

export default class MenuScreen extends game.Screen {

    constructor() {
        super();
        const menu = new Menu();
        this.frontUi = menu;
        menu.once(game.Event.DONE, () => this.emit(game.Event.DONE));
    }
}
