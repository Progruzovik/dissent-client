package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.socket.model.MessageSender;

public interface Player extends Captain {

    Status getStatus();

    MessageSender getMessageSender();

    void addToQueue();

    void removeFromQueue();

    void startMission(int missionIndex);
}
