package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.socket.Sender;

public interface Player extends Captain, Sender {

    Status getStatus();

    void addToQueue();

    void removeFromQueue();

    void startMission(int missionIndex);
}
