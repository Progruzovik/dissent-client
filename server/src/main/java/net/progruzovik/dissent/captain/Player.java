package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.model.message.Sender;
import org.springframework.lang.NonNull;

public interface Player extends Captain, Sender {

    @NonNull
    Status getStatus();

    void addToQueue();

    void removeFromQueue();

    void startMission(int missionIndex);
}
