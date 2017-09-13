package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.player.Player;
import org.eclipse.jetty.http.HttpStatus;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
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

    @GetMapping("/current")
    public Unit getCurrentUnit() {
        return player.getField().getCurrentUnit();
    }

    @PostMapping("/current/cell")
    public void postCurrentUnitCell(@RequestParam("col") int col, @RequestParam("row") int row,
                                    HttpServletResponse response) {
        if (!player.getField().moveCurrentUnit(player, col, row)) {
            response.setStatus(HttpStatus.BAD_REQUEST_400);
        }
    }

    @GetMapping("/queue")
    public Queue<Unit> getQueue() {
        return player.getField().getQueue();
    }
}
