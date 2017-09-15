package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.player.Player;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Queue;

@RestController
@RequestMapping("/api/field")
public final class FieldRest {

    private final Player player;

    public FieldRest(@Qualifier("sessionPlayer") Player player) {
        this.player = player;
    }

    @GetMapping("/size")
    public Map<String, Integer> getSize() {
        Map<String, Integer> result = new HashMap<>(2);
        result.put("x", player.getField().getColsCount());
        result.put("y", player.getField().getRowsCount());
        return result;
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
    public ResponseEntity postCurrentUnitCell(@RequestBody Map<String, Integer> cell) {
        return player.getField().moveCurrentUnit(player, cell.get("x"), cell.get("y"))
                ? new ResponseEntity(HttpStatus.OK)
                : new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/queue")
    public Queue<Unit> getQueue() {
        return player.getField().getQueue();
    }
}
