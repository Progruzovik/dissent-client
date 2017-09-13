package net.progruzovik.dissent.config;

import net.progruzovik.dissent.battle.Field;
import net.progruzovik.dissent.battle.FieldFactory;
import net.progruzovik.dissent.battle.FieldService;
import net.progruzovik.dissent.player.Player;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
@ComponentScan("net.progruzovik.dissent")
public class AppConfig {

    @Bean
    FieldFactory fieldFactory() {
        return this::field;
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    Field field(@Qualifier("sessionPlayer") Player leftPlayer, @Qualifier("aiPlayer") Player rightPlayer) {
        return new FieldService(leftPlayer, rightPlayer);
    }
}
