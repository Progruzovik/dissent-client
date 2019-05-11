package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.event.Event;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.List;
import java.util.function.Consumer;

public interface Captain extends Consumer<Event<?>> {

    @NonNull
    String getId();

    @NonNull
    List<Ship> getShips();

    @Nullable
    Battle getBattle();

    void addToBattle(@NonNull Side side, @NonNull Battle battle);
}
