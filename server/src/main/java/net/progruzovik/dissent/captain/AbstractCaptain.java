package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.model.entity.Ship;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractCaptain implements Captain {

    private final List<Ship> ships = new ArrayList<>();
    private Battle battle;

    @NonNull
    @Override
    public List<Ship> getShips() {
        return ships;
    }

    @Nullable
    @Override
    public Battle getBattle() {
        return battle;
    }

    @Override
    public void addToBattle(@NonNull Side side, @NonNull Battle battle) {
        battle.addObserver(this);
        battle.addShips(side, ships);
        this.battle = battle;
    }
}
