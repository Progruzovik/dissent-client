import BattleApp from "./Battle/BattleApp";
import * as PIXI from "pixi.js";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.utils.skipHello();
const battle = new BattleApp();
document.body.appendChild(battle.view);
resizeBattle();

window.onresize = resizeBattle;

function resizeBattle() {
    battle.resize(window.innerWidth, window.innerHeight);
}
