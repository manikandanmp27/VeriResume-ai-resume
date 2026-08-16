package com.verita.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
@Slf4j
public class DatabaseConfig {

    @Value("${spring.datasource.url:${DATABASE_URL:${DB_URL:jdbc:postgresql://localhost:5432/verita_db}}}")
    private String rawUrl;

    @Value("${spring.datasource.username:${DB_USERNAME:verita_user}}")
    private String defaultUsername;

    @Value("${spring.datasource.password:${DB_PASSWORD:verita_password}}")
    private String defaultPassword;

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        String finalJdbcUrl = rawUrl;
        String finalUsername = defaultUsername;
        String finalPassword = defaultPassword;

        // Automatically convert Render/Cloud URI format (postgres:// or postgresql://) to JDBC format (jdbc:postgresql://)
        if (rawUrl != null && (rawUrl.startsWith("postgres://") || (rawUrl.startsWith("postgresql://") && !rawUrl.startsWith("jdbc:")))) {
            try {
                URI uri = new URI(rawUrl.replace("postgres://", "http://").replace("postgresql://", "http://"));
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                String userInfo = uri.getUserInfo();

                if (userInfo != null && userInfo.contains(":")) {
                    String[] credentials = userInfo.split(":", 2);
                    finalUsername = credentials[0];
                    finalPassword = credentials[1];
                }

                StringBuilder jdbcBuilder = new StringBuilder("jdbc:postgresql://")
                        .append(host)
                        .append(":")
                        .append(port)
                        .append(path);

                if (uri.getQuery() != null) {
                    jdbcBuilder.append("?").append(uri.getQuery());
                }

                finalJdbcUrl = jdbcBuilder.toString();
                log.info("Successfully converted cloud PostgreSQL URI to JDBC URL for host: {}:{}", host, port);
            } catch (Exception ex) {
                log.warn("Could not parse cloud database URI '{}', falling back to prepending jdbc: {}", rawUrl, ex.getMessage());
                if (!rawUrl.startsWith("jdbc:")) {
                    finalJdbcUrl = "jdbc:" + rawUrl;
                }
            }
        }

        config.setJdbcUrl(finalJdbcUrl);
        config.setUsername(finalUsername);
        config.setPassword(finalPassword);
        config.setDriverClassName(driverClassName);
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        return new HikariDataSource(config);
    }
}
