package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.assembler.MessageAssembler;
import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.event.Event;
import net.progruzovik.dissent.model.event.EventSubject;
import net.progruzovik.dissent.model.message.Sender;
import net.progruzovik.dissent.model.message.ServerMessage;
import net.progruzovik.dissent.model.message.ServerSubject;
import net.progruzovik.dissent.repository.GunRepository;
import net.progruzovik.dissent.repository.HullRepository;
import net.progruzovik.dissent.service.MissionDigest;
import net.progruzovik.dissent.service.PlayerQueue;
import net.progruzovik.dissent.socket.WebSocketSender;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketSession;

@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public final class SessionPlayer extends AbstractCaptain implements Player {

    private @NonNull String id = "";

    private final PlayerQueue queue;
    private final MissionDigest missionDigest;
    private final Sender sender;

    private final MessageAssembler messageAssembler;

    public SessionPlayer(PlayerQueue queue, MissionDigest missionDigest, WebSocketSender sender,
                         MessageAssembler messageAssembler, HullRepository hullRepository, GunRepository gunRepository) {
        final Hull pointerHull = hullRepository.findById(3).get();
        final Gun laser = gunRepository.findById(3).get();
        getShips().add(new Ship(pointerHull, laser, null));
        getShips().add(new Ship(hullRepository.findById(7).get(), laser, gunRepository.findById(1).get()));
        getShips().add(new Ship(pointerHull, laser, null));

        this.queue = queue;
        this.missionDigest = missionDigest;
        this.sender = sender;
        this.messageAssembler = messageAssembler;
    }

    @Override
    public void setSession(@NonNull WebSocketSession session) {
        id = session.getId();
        sender.setSession(session);
    }

    @NonNull
    @Override
    public String getId() {
        return id;
    }

    @NonNull
    @Override
    public Status getStatus() {
        if (getBattle() != null && getBattle().isRunning()) return Status.IN_BATTLE;
        if (queue.isQueued(this)) return Status.QUEUED;
        return Status.IDLE;
    }

    @Override
    public void accept(Event<?> event) {
        if (event.getSubject().equals(EventSubject.BATTLE_FINISH)) {
            onBattleFinish();
        }
        if (event.getSubject().isPublic()) {
            sendMessage(messageAssembler.apply(event));
        }
    }

    @Override
    public void addToBattle(@NonNull Side side, @NonNull Battle battle) {
        if (getStatus() == Status.IN_BATTLE) {
            onBattleFinish();
            sendMessage(new ServerMessage<>(ServerSubject.BATTLE_FINISH));
        }
        super.addToBattle(side, battle);
        sendCurrentStatus();
    }

    @Override
    public void addToQueue() {
        if (getStatus() != Status.IDLE) return;
        queue.add(this);
        sendCurrentStatus();
    }

    @Override
    public void removeFromQueue() {
        if (getStatus() != Status.QUEUED) return;
        queue.remove(this);
        sendCurrentStatus();
    }

    @Override
    public void startMission(int missionId) {
        if (getStatus() != Status.IDLE) return;
        missionDigest.startMission(this, missionId);
    }

    @Override
    public <T> void sendMessage(@NonNull ServerMessage<T> message) {
        sender.sendMessage(message);
    }

    private void onBattleFinish() {
        for (final Ship ship : getShips()) {
            ship.setStrength(ship.getHull().getStrength());
        }
    }

    private void sendCurrentStatus() {
        sendMessage(new ServerMessage<>(ServerSubject.STATUS, getStatus()));
    }
}
