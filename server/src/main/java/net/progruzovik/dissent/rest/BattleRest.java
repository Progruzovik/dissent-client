package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.battle.Scenario;
import net.progruzovik.dissent.model.Unit;
import net.progruzovik.dissent.player.Player;
import org.eclipse.jetty.http.HttpStatus;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.Queue;

@RestController
@RequestMapping("/api/battle")
public final class BattleRest {

    private final Scenario scenario;

    public BattleRest(Scenario scenario) {
        this.scenario = scenario;
    }

    @PostMapping("/scenario")
    public void postScenario() {
        scenario.start();
    }
}
