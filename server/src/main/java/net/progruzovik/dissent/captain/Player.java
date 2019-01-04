package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.model.message.Sender;

public interface Player extends Captain, Sender {

    Status getStatus();

    void addToQueue();

    void removeFromQueue();

    void startMission(int missionIndex);
}
