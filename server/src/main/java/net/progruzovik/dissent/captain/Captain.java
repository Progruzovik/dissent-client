package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.event.Event;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.List;

public interface Captain {

    @NonNull
    String getId();

    @NonNull
    List<Ship> getShips();

    @Nullable
    Battle getBattle();

    void onEvent(@NonNull Event<?> event);

    void addToBattle(@NonNull Side side, @NonNull Battle battle);
}
