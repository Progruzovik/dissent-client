package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.battle.Side;
import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Ship;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.util.Point;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/field")
public final class FieldRest {

    private final Player player;

    public FieldRest(@Qualifier("sessionPlayer") Player player) {
        this.player = player;
    }

    @GetMapping("/size")
    public Point getSize() {
        return player.getField().getSize();
    }

    @GetMapping("/asteroids")
    public Collection<Point> getAsteroids() {
        return player.getField().getAsteroids();
    }

    @GetMapping("/units")
    public Collection<Unit> getUnits() {
        return player.getField().getUnitQueue();
    }

    @GetMapping("/ships")
    public Collection<Ship> getUniqueShips() {
        return player.getField().getUniqueShips();
    }

    @GetMapping("/guns")
    public Collection<Gun> getUniqueGuns() {
        return player.getField().getUniqueGuns();
    }

    @GetMapping("/side")
    public Side getSide() {
        return player.getField().getPlayerSide(player);
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

    @GetMapping("/unit/paths")
    public List<List<Point>> getCurrentPaths() {
        return player.getField().getCurrentPaths();
    }

    @GetMapping("/unit/cells")
    public Collection<Point> getCurrentReachableCells() {
        return player.getField().getCurrentReachableCells();
    }

    @PostMapping("/unit/cell")
    public ResponseEntity postCurrentUnitCell(@RequestBody Point cell) {
        return player.getField().moveCurrentUnit(player, cell) ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }
}
