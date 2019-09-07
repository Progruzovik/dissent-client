package net.progruzovik.dissent.service;

import net.progruzovik.dissent.captain.Captain;
import org.springframework.lang.NonNull;

public interface BattleCreator {

    void createBattle(@NonNull Captain leftCaptain, @NonNull Captain rightCaptain);
}
