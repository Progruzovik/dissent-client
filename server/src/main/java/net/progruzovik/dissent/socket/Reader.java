package net.progruzovik.dissent.socket;

import net.progruzovik.dissent.captain.Player;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.Map;

@FunctionalInterface
public interface Reader {

    void read(@NonNull Player player, @Nullable Map<String, Integer> data);
}
