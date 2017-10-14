package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.model.player.Session;
import net.progruzovik.dissent.model.player.Status;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;

@RestController
@RequestMapping("/api/player")
public final class PlayerRest {

    private final Session session;

    public PlayerRest(Session session) {
        this.session = session;
    }

    @GetMapping("/status")
    public Status getStatus() {
        return session.getStatus();
    }

    @GetMapping("/status/next")
    public DeferredResult<Status> getNextStatus() {
        final DeferredResult<Status> result = new DeferredResult<>();
        session.setDeferredStatus(result);
        return result;
    }

    @PostMapping("/queue")
    public ResponseEntity postQueue() {
        return session.addToQueue() ? new ResponseEntity(HttpStatus.OK) : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/queue")
    public ResponseEntity deleteQueue() {
        return session.removeFromQueue() ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/scenario")
    public ResponseEntity postScenario() {
        return session.startScenario() ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }
}
