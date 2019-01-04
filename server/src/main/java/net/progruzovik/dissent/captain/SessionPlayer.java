package net.progruzovik.dissent.captain;

import net.progruzovik.dissent.assembler.MessageAssembler;
import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.dao.GunDao;
import net.progruzovik.dissent.dao.HullDao;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.entity.Ship;
import net.progruzovik.dissent.model.event.Event;
import net.progruzovik.dissent.model.event.EventSubject;
import net.progruzovik.dissent.model.message.ServerMessage;
import net.progruzovik.dissent.model.message.ServerSubject;
import net.progruzovik.dissent.service.MissionDigest;
import net.progruzovik.dissent.service.PlayerQueue;
import net.progruzovik.dissent.model.message.Sender;
import net.progruzovik.dissent.socket.WebSocketSender;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.Observable;

@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public final class SessionPlayer extends AbstractCaptain implements Player {

    private String id;

    private final PlayerQueue queue;
    private final MissionDigest missionDigest;
    private final Sender sender;

    private final MessageAssembler messageAssembler;

    public SessionPlayer(PlayerQueue queue, MissionDigest missionDigest, WebSocketSender sender,
                         MessageAssembler messageAssembler, HullDao hullDao, GunDao gunDao) {
        final Hull pointerHull = hullDao.getHull(3);
        final Gun laser = gunDao.getGun(3);
        getShips().add(new Ship(pointerHull, laser, null));
        getShips().add(new Ship(hullDao.getHull(7), laser, gunDao.getGun(1)));
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

    @Override
    public String getId() {
        return id;
    }

    @Override
    public Status getStatus() {
        if (getBattle() != null && getBattle().isRunning()) return Status.IN_BATTLE;
        if (queue.isQueued(this)) return Status.QUEUED;
        return Status.IDLE;
    }

    @Override
    public void update(Observable battle, Object data) {
        final Event<?> event = (Event<?>) data;
        if (event.getSubject().equals(EventSubject.BATTLE_FINISH)) {
            onBattleFinish();
        }
        if (event.getSubject().isPublic()) {
            sendMessage(messageAssembler.apply(event));
        }
    }

    @Override
    public void addToBattle(Side side, Battle battle) {
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
    public <T> void sendMessage(ServerMessage<T> message) {
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
