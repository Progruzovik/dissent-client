package net.progruzovik.dissent.rest;

import net.progruzovik.dissent.battle.captain.Player;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/player")
public final class PlayerRest {

    private final Player player;

    public PlayerRest(Player player) {
        this.player = player;
    }

    @GetMapping("/id")
    public String getId() {
        return player.getId();
    }
}
