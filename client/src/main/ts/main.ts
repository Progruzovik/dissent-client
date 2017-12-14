import BattleApp from "./Battle/BattleApp";
import * as PIXI from "pixi.js";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.utils.skipHello();
window.onresize = () => battle.resize();

const battle = new BattleApp();
document.body.appendChild(battle.view);
battle.resize();
