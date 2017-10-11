package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.battle.Queue;
import net.progruzovik.dissent.battle.Scenario;
import net.progruzovik.dissent.model.player.Session;
import net.progruzovik.dissent.model.player.Status;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/player")
public final class PlayerRest {

    private final Session session;
    private final Queue queue;
    private final Scenario scenario;

    public PlayerRest(Session session, Queue queue, Scenario scenario) {
        this.session = session;
        this.queue = queue;
        this.scenario = scenario;
    }

    @GetMapping("/status")
    public Status getStatus() {
        return session.getStatus();
    }

    @PostMapping("/queue")
    public ResponseEntity postQueue() {
        return queue.add(session) ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/queue")
    public ResponseEntity deleteQueue() {
        return queue.remove(session) ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/scenario")
    public void postScenario() {
        queue.remove(session);
        scenario.start(session);
    }
}
