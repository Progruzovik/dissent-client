import BattleApp from "./Battle/BattleApp";
import * as PIXI from "pixi.js";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.utils.skipHello();
const battle = new BattleApp(window.devicePixelRatio || 1, window.innerWidth, window.innerHeight);
document.body.appendChild(battle.view);

window.onresize = () => battle.resize(window.innerWidth, window.innerHeight);
