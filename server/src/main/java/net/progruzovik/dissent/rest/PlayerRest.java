package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.player.Status;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;

@RestController
@RequestMapping("/api/player")
public final class PlayerRest {

    private final Player player;

    public PlayerRest(Player player) {
        this.player = player;
    }

    @GetMapping("/status")
    public Status getStatus() {
        return player.getStatus();
    }

    @GetMapping("/status/next")
    public DeferredResult<Status> getNextStatus() {
        final DeferredResult<Status> result = new DeferredResult<>();
        player.setDeferredStatus(result);
        return result;
    }

    @PostMapping("/queue")
    public ResponseEntity postQueue() {
        return player.addToQueue() ? new ResponseEntity(HttpStatus.OK) : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/queue")
    public ResponseEntity deleteQueue() {
        return player.removeFromQueue() ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/scenario")
    public ResponseEntity postScenario() {
        return player.startScenario() ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }
}
