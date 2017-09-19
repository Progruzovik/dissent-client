package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.battle.Scenario;
import org.springframework.web.bind.annotation.*;

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
