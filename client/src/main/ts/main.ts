import BattleApp from "./Battle/BattleApp";

PIXI.utils.skipHello();
window.onresize = () => battle.resize();

const battle = new BattleApp();
document.body.appendChild(battle.view);
battle.resize();
