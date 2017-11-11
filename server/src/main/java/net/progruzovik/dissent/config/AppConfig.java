package net.progruzovik.dissent.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.ser.DefaultSerializerProvider;
import net.progruzovik.dissent.config.json.NullValueSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
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
}
