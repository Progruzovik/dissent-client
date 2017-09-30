package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.model.battle.Action;
import net.progruzovik.dissent.model.battle.Side;
import net.progruzovik.dissent.model.Gun;
import net.progruzovik.dissent.model.Hull;
import net.progruzovik.dissent.model.battle.Unit;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.player.SessionPlayer;
import net.progruzovik.dissent.model.util.Cell;
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
    public Cell getSize() {
        return player.getBattle().getField().getSize();
    }

    @GetMapping("/asteroids")
    public Collection<Cell> getAsteroids() {
        return player.getBattle().getField().getAsteroids();
    }

    @GetMapping("/units")
    public Collection<Unit> getUnits() {
        return player.getBattle().getUnitQueue().getQueue();
    }

    @GetMapping("/ships")
    public Collection<Hull> getUniqueHulls() {
        return player.getBattle().getUnitQueue().getUniqueHulls();
    }

    @GetMapping("/guns")
    public Collection<Gun> getUniqueGuns() {
        return player.getBattle().getUnitQueue().getUniqueGuns();
    }

    @GetMapping("/side")
    public Side getSide() {
        return player.getBattle().getPlayerSide(player.getId());
    }

    @GetMapping("/actions")
    public Collection<Action> getActions(@RequestParam(required = false) Integer fromIndex) {
        return player.getBattle().getActions(fromIndex == null ? 0 : fromIndex);
    }

    @GetMapping("/actions/count")
    public int getActionsCount() {
        return player.getBattle().getActionsCount();
    }

    @GetMapping("/unit")
    public Unit getCurrentUnit() {
        return player.getBattle().getUnitQueue().getCurrentUnit();
    }

    @GetMapping("/unit/paths")
    public List<List<Cell>> getCurrentPaths() {
        return player.getBattle().getField().getCurrentPaths();
    }

    @GetMapping("/unit/cells")
    public Collection<Cell> getCurrentReachableCells() {
        return player.getBattle().findReachableCellsForCurrentUnit();
    }

    @PostMapping("/unit/cell")
    public ResponseEntity postCurrentUnitCell(@RequestBody Cell cell) {
        return player.getBattle().moveCurrentUnit(player.getId(), cell) ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/unit/shot")
    public ResponseEntity<Map<String, List<Cell>>> getCellsForCurrentUnitShot(@RequestParam int gunNumber) {
        if (player.getBattle().prepareCurrentUnitGun(player.getId(), gunNumber)) {
            return new ResponseEntity<>(player.getBattle().findCellsForCurrentUnitShot(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/unit/shot")
    public ResponseEntity postCurrentUnitShot(@RequestBody Cell cell) {
        if (player.getBattle().shootWithCurrentUnit(player.getId(), cell)) {
            return new ResponseEntity(HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/turn")
    public ResponseEntity postTurn() {
        return player.getBattle().nextTurn(player.getId()) ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }
}
