import BattleApp from "./Battle/BattleApp";
import axios from "axios";

PIXI.utils.skipHello();
axios.post("api/battle/scenario").then(() => {
    const battle = new BattleApp();
    document.body.appendChild(battle.view);
});
