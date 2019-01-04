package net.progruzovik.dissent.socket;

import net.progruzovik.dissent.captain.Player;
import org.springframework.lang.NonNull;

import java.util.Map;

@FunctionalInterface
public interface Reader {

    void read(@NonNull Player player, @NonNull Map<String, Integer> data);
}
