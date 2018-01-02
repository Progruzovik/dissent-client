package net.progruzovik.dissent.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.ser.DefaultSerializerProvider;
import net.progruzovik.dissent.battle.BattleFactory;
import net.progruzovik.dissent.config.json.NullValueSerializer;
import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.battle.model.UnitQueue;
import net.progruzovik.dissent.battle.model.field.Field;
import net.progruzovik.dissent.model.util.Cell;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;

import static net.progruzovik.dissent.battle.model.field.Field.BORDER_INDENT;
import static net.progruzovik.dissent.battle.model.field.Field.UNIT_INDENT;

@Configuration
@ComponentScan("net.progruzovik.dissent")
public class AppConfig {

    @Bean
    public BattleFactory battleFactory() {
        return (lc, rc) -> {
            final int maxShipsCountOnSide = Math.max(lc.getShips().size(), rc.getShips().size());
            final int colsCount = maxShipsCountOnSide * UNIT_INDENT + BORDER_INDENT * 2;
            final Battle battle = new Battle(lc, rc, new UnitQueue(), new Field(new Cell(colsCount, colsCount)));
            lc.registerBattle(Side.LEFT, battle);
            rc.registerBattle(Side.RIGHT, battle);
            battle.startBattle();
            return battle;
        };
    }

    @Bean
    public ObjectMapper objectMapper() {
        final ObjectMapper result = new ObjectMapper();
        DefaultSerializerProvider serializerProvider = new DefaultSerializerProvider.Impl();
        serializerProvider.setNullValueSerializer(new NullValueSerializer());
        result.setSerializerProvider(serializerProvider);
        result.enable(SerializationFeature.WRITE_ENUMS_USING_INDEX);
        return result;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        final LocalContainerEntityManagerFactoryBean result = new LocalContainerEntityManagerFactoryBean();
        result.setPackagesToScan("net.progruzovik.dissent");
        result.setDataSource(dataSource);
        result.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        return result;
    }

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
                .addScript("schema.sql")
                .setType(EmbeddedDatabaseType.H2)
                .build();
    }
}
