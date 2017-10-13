package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.model.battle.Side;
import net.progruzovik.dissent.model.battle.Unit;
import net.progruzovik.dissent.model.battle.action.Move;
import net.progruzovik.dissent.model.battle.action.Shot;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.player.Session;
import net.progruzovik.dissent.model.util.Cell;
import net.progruzovik.dissent.model.battle.action.DeferredAction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/battle")
public final class BattleRest {

    private final Session session;

    public BattleRest(Session session) {
        this.session = session;
    }

    @GetMapping("/size")
    public Cell getSize() {
        return session.getBattle().getField().getSize();
    }

    @GetMapping("/asteroids")
    public Collection<Cell> getAsteroids() {
        return session.getBattle().getField().getAsteroids();
    }

    @GetMapping("/units")
    public Collection<Unit> getUnits() {
        return session.getBattle().getUnitQueue().getQueue();
    }

    @GetMapping("/hulls")
    public Collection<Hull> getHulls() {
        return session.getBattle().getUnitQueue().getUniqueHulls();
    }

    @GetMapping("/guns")
    public Collection<Gun> getGuns() {
        return session.getBattle().getUnitQueue().getUniqueGuns();
    }

    @GetMapping("/side")
    public Side getSide() {
        return session.getBattle().getPlayerSide(session.getId());
    }

    @GetMapping("/action/{number}")
    public DeferredAction getActions(@PathVariable int number) {
        final DeferredAction result = new DeferredAction(number);
        if (session.getBattle().getActionsCount() > number) {
            result.setResult(session.getBattle().getAction(number));
        } else {
            session.setDeferredAction(result);
        }
        return result;
    }

    @GetMapping("/actions/count")
    public int getActionsCount() {
        return session.getBattle().getActionsCount();
    }

    @GetMapping("/move/{number}")
    public Move getMove(@PathVariable int number) {
        return session.getBattle().getMove(number);
    }

    @GetMapping("/shot/{number}")
    public Shot getShot(@PathVariable int number) {
        return session.getBattle().getShot(number);
    }

    @GetMapping("/unit")
    public Unit getCurrentUnit() {
        return session.getBattle().getUnitQueue().getCurrentUnit();
    }

    @GetMapping("/unit/paths")
    public List<List<Cell>> getCurrentPaths() {
        return session.getBattle().getField().getCurrentPaths();
    }

    @GetMapping("/unit/cells")
    public Collection<Cell> getCurrentReachableCells() {
        return session.getBattle().findReachableCellsForCurrentUnit();
    }

    @PostMapping("/unit/cell")
    public ResponseEntity postCurrentUnitCell(@RequestBody Cell cell) {
        return session.getBattle().moveCurrentUnit(session.getId(), cell) ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/unit/shot")
    public Map<String, List<Cell>> getCellsForCurrentUnitShot(@RequestParam int gunId) {
        return session.getBattle().findCellsForCurrentUnitShot(gunId);
    }

    @PostMapping("/unit/shot")
    public ResponseEntity postCurrentUnitShot(@RequestParam int gunId, @RequestBody Cell cell) {
        if (session.getBattle().shootWithCurrentUnit(session.getId(), gunId, cell)) {
            return new ResponseEntity(HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/turn")
    public ResponseEntity postTurn() {
        return session.getBattle().endTurn(session.getId()) ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }
}
