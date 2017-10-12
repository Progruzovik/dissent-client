package net.progruzovik.dissent.model.player;

import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.model.battle.action.DeferredAction;

final class BattleConnector {

    private DeferredAction deferredAction;
    private final Battle battle;

    BattleConnector(Battle battle) {
        this.battle = battle;
    }

    void setDeferredAction(DeferredAction deferredAction) {
        this.deferredAction = deferredAction;
    }

    DeferredAction getDeferredAction() {
        return deferredAction;
    }

    Battle getBattle() {
        return battle;
    }
}
