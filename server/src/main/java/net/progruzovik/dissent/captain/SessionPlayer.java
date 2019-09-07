package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.model.domain.CaptainStatus;
import net.progruzovik.dissent.model.domain.battle.Battle;
import net.progruzovik.dissent.model.domain.battle.Side;
import net.progruzovik.dissent.mapper.MessageMapper;
import net.progruzovik.dissent.model.entity.GunEntity;
import net.progruzovik.dissent.model.entity.HullEntity;
import net.progruzovik.dissent.model.domain.Ship;
import net.progruzovik.dissent.model.event.Event;
import net.progruzovik.dissent.model.event.EventSubject;
import net.progruzovik.dissent.model.message.Sender;
import net.progruzovik.dissent.model.message.ServerMessage;
import net.progruzovik.dissent.model.message.ServerSubject;
import net.progruzovik.dissent.repository.GunRepository;
import net.progruzovik.dissent.repository.HullRepository;
import net.progruzovik.dissent.service.MissionDigest;
import net.progruzovik.dissent.service.PlayerQueue;
import net.progruzovik.dissent.socket.DissentWebSocketSender;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketSession;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public final class SessionPlayer extends AbstractCaptain implements Player {

    private @NonNull String id = "";

    private final PlayerQueue queue;
    private final MissionDigest missionDigest;
    private final Sender sender;

    private final MessageMapper messageMapper;

    public SessionPlayer(PlayerQueue queue, MissionDigest missionDigest, DissentWebSocketSender sender,
                         MessageMapper messageMapper, HullRepository hullRepository, GunRepository gunRepository) {
        HullEntity pointerHull = hullRepository.findById(3).get();
        GunEntity laser = gunRepository.findById(3).get();
        getShips().add(new Ship(pointerHull, laser, null));
        getShips().add(new Ship(hullRepository.findById(7).get(), laser, gunRepository.findById(1).get()));
        getShips().add(new Ship(pointerHull, laser, null));

        this.queue = queue;
        this.missionDigest = missionDigest;
        this.sender = sender;
        this.messageMapper = messageMapper;
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
    public CaptainStatus getStatus() {
        if (getBattle() != null && getBattle().isRunning()) return CaptainStatus.IN_BATTLE;
        if (queue.isQueued(this)) return CaptainStatus.QUEUED;
        return CaptainStatus.IDLE;
    }

    @Override
    public void accept(Event<?> event) {
        if (event.getSubject().equals(EventSubject.BATTLE_FINISH)) {
            onBattleFinish();
        }
        if (event.getSubject().isPublic()) {
            sendMessage(messageMapper.apply(event));
        }
    }

    @Override
    public void addToBattle(@NonNull Side side, @NonNull Battle battle) {
        if (getStatus() == CaptainStatus.IN_BATTLE) {
            onBattleFinish();
            sendMessage(new ServerMessage<>(ServerSubject.BATTLE_FINISH));
        }
        super.addToBattle(side, battle);
        sendCurrentStatus();
    }

    @Override
    public void addToQueue() {
        if (getStatus() != CaptainStatus.IDLE) return;
        queue.add(this);
        sendCurrentStatus();
    }

    @Override
    public void removeFromQueue() {
        if (getStatus() != CaptainStatus.QUEUED) return;
        queue.remove(this);
        sendCurrentStatus();
    }

    @Override
    public void startMission(int missionId) {
        if (getStatus() != CaptainStatus.IDLE) return;
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
