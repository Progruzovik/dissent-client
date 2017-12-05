import BattleApp from "./Battle/BattleApp";

PIXI.utils.skipHello();
const battle = new BattleApp();
document.body.appendChild(battle.view);
battle.resize();

window.onresize = () => battle.resize();
