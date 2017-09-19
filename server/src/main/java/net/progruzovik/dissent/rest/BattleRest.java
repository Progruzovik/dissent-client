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
@RequestMapping("/api/battle")
public final class BattleRest {

    private final Player player;

    public BattleRest(@Qualifier("sessionPlayer") Player player) {
        this.player = player;
    }

    @GetMapping("/size")
    public Point getSize() {
        return player.getBattle().getField().getSize();
    }

    @GetMapping("/asteroids")
    public Collection<Point> getAsteroids() {
        return player.getBattle().getField().getAsteroids();
    }

    @GetMapping("/units")
    public Collection<Unit> getUnits() {
        return player.getBattle().getUnitQueue();
    }

    @GetMapping("/ships")
    public Collection<Ship> getUniqueShips() {
        return player.getBattle().getUniqueShips();
    }

    @GetMapping("/guns")
    public Collection<Gun> getUniqueGuns() {
        return player.getBattle().getUniqueGuns();
    }

    @GetMapping("/side")
    public Side getSide() {
        return player.getBattle().getPlayerSide(player);
    }

    @GetMapping("/turn")
    public int getTurnNumber() {
        return player.getBattle().getTurnNumber();
    }

    @PostMapping("/turn")
    public ResponseEntity postTurn() {
        return player.getBattle().nextTurn(player) ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/unit")
    public Unit getCurrentUnit() {
        return player.getBattle().getCurrentUnit();
    }

    @GetMapping("/unit/paths")
    public List<List<Point>> getCurrentPaths() {
        return player.getBattle().getField().getPaths();
    }

    @GetMapping("/unit/cells")
    public Collection<Point> getCurrentReachableCells() {
        return player.getBattle().getCurrentUnitReachableCells();
    }

    @PostMapping("/unit/cell")
    public ResponseEntity postCurrentUnitCell(@RequestBody Point cell) {
        return player.getBattle().moveCurrentUnit(player, cell) ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/unit/gun")
    public int getCurrentGunCells(@RequestParam int number) {
        return number;
    }
}
