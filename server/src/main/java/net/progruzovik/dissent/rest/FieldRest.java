package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.model.Ship;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.player.Player;
import net.progruzovik.dissent.util.Point;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Queue;

@RestController
@RequestMapping("/api/field")
public final class FieldRest {

    private final Player player;

    public FieldRest(@Qualifier("sessionPlayer") Player player) {
        this.player = player;
    }

    @GetMapping("/ships")
    public List<Ship> getShips() {
        return player.getField().getShips();
    }

    @GetMapping("/size")
    public Point getSize() {
        return player.getField().getSize();
    }

    @GetMapping("/side")
    public int getSide() {
        return player.getField().getPlayerSide(player).ordinal();
    }

    @GetMapping("/turn")
    public int getTurnNumber() {
        return player.getField().getTurnNumber();
    }

    @PostMapping("/turn")
    public ResponseEntity postTurn() {
        return player.getField().nextTurn(player) ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/unit")
    public Unit getCurrentUnit() {
        return player.getField().getCurrentUnit();
    }

    @PostMapping("/unit/cell")
    public ResponseEntity postCurrentUnitCell(@RequestBody Point cell) {
        return player.getField().moveCurrentUnit(player, cell) ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/units")
    public Queue<Unit> getUnits() {
        return player.getField().getQueue();
    }
}
