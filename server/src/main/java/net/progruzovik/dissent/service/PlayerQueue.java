package net.progruzovik.dissent.service;

import net.progruzovik.dissent.captain.Player;
import org.springframework.lang.NonNull;

public interface PlayerQueue {

    boolean isQueued(@NonNull Player player);

    void add(@NonNull Player player);

    void remove(@NonNull Player player);
}
