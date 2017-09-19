package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.battle.Scenario;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scenario")
public final class ScenarioRest {

    private final Scenario scenario;

    public ScenarioRest(Scenario scenario) {
        this.scenario = scenario;
    }

    @PostMapping
    public void postScenario() {
        scenario.start();
    }
}
