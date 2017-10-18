package net.progruzovik.dissent.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.ser.DefaultSerializerProvider;
import net.progruzovik.dissent.battle.Battle;
import net.progruzovik.dissent.battle.BattleFactory;
import net.progruzovik.dissent.battle.BattleService;
import net.progruzovik.dissent.config.json.NullValueSerializer;
import net.progruzovik.dissent.model.player.Captain;
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
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
                .addScript("schema.sql")
                .setType(EmbeddedDatabaseType.H2)
                .build();
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
    public ObjectMapper objectMapper() {
        final ObjectMapper result = new ObjectMapper();
        DefaultSerializerProvider serializerProvider = new DefaultSerializerProvider.Impl();
        serializerProvider.setNullValueSerializer(new NullValueSerializer());
        result.setSerializerProvider(serializerProvider);
        result.enable(SerializationFeature.WRITE_ENUMS_USING_INDEX);
        return result;
    }

    @Bean
    BattleFactory battleFactory() {
        return this::battle;
    }

    @Bean
    @Scope(BeanDefinition.SCOPE_PROTOTYPE)
    Battle battle(@Qualifier("sessionPlayer") Captain leftCaptain, @Qualifier("aiCaptain") Captain rightCaptain) {
        return new BattleService(leftCaptain, rightCaptain);
    }
}
