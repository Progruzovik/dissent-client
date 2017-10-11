package net.progruzovik.dissent.config;

import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.battle.BattleFactory;
import net.progruzovik.dissent.battle.BattleService;
import net.progruzovik.dissent.model.player.Player;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;

@Configuration
@ComponentScan("net.progruzovik.dissent")
public class AppConfig {

    @Bean
    BattleFactory battleFactory() {
        return this::battle;
    }

    @Bean
    @Scope(BeanDefinition.SCOPE_PROTOTYPE)
    Battle battle(@Qualifier("sessionPlayer") Player leftPlayer, @Qualifier("aiPlayer") Player rightPlayer) {
        return new BattleService(leftPlayer, rightPlayer);
    }

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
                .addScript("schema.sql")
                .setType(EmbeddedDatabaseType.H2)
                .build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
        entityManagerFactory.setPackagesToScan("net.progruzovik.dissent");
        entityManagerFactory.setDataSource(dataSource);
        entityManagerFactory.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        return entityManagerFactory;
    }
}
