package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.model.battle.Side;
import net.progruzovik.dissent.model.battle.Unit;
import net.progruzovik.dissent.model.entity.Gun;
import net.progruzovik.dissent.model.entity.Hull;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.util.Cell;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/battle")
public final class BattleRest {

    private final Player player;

    public BattleRest(Player player) {
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

    @GetMapping("/clouds")
    public Collection<Cell> getClouds() {
        return player.getBattle().getField().getClouds();
    }

    @GetMapping("/hulls")
    public Collection<Hull> getHulls() {
        return player.getBattle().getUnitQueue().getUniqueHulls();
    }

    @GetMapping("/guns")
    public Collection<Gun> getGuns() {
        return player.getBattle().getUnitQueue().getUniqueGuns();
    }

    @GetMapping("/side")
    public Side getSide() {
        return player.getBattle().getPlayerSide(player.getId());
    }

    @GetMapping("/unit")
    public Unit getCurrentUnit() {
        return player.getBattle().getUnitQueue().getCurrentUnit();
    }

    @GetMapping("/unit/paths")
    public List<List<Cell>> getCurrentPaths() {
        return player.getBattle().getField().getCurrentPaths();
    }

    @PostMapping("/unit/cell")
    public ResponseEntity postCurrentUnitCell(@RequestBody Cell cell) {
        return player.getBattle().moveCurrentUnit(player.getId(), cell) ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/unit/cells")
    public Collection<Cell> getCellsForCurrentUnitMove() {
        return player.getBattle().findCellsForCurrentUnitMove();
    }

    @GetMapping("/unit/shot")
    public Map<String, List<Cell>> getCellsForCurrentUnitShot(@RequestParam int gunId) {
        return player.getBattle().findCellsForCurrentUnitShot(gunId);
    }

    @PostMapping("/unit/shot")
    public ResponseEntity postCurrentUnitShot(@RequestParam int gunId, @RequestBody Cell cell) {
        if (player.getBattle().shootWithCurrentUnit(player.getId(), gunId, cell)) {
            return new ResponseEntity(HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/units")
    public Collection<Unit> getUnits() {
        return player.getBattle().getUnitQueue().getQueue();
    }

    @GetMapping("/units/destroyed")
    public Collection<Unit> getDestroyedUnits() {
        return player.getBattle().getField().getDestroyedUnits();
    }
}
