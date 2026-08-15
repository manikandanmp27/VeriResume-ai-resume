package com.verita.config;

import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.credentials.path:#{null}}")
    private String credentialsPath;

    @Value("${firebase.config.json:#{null}}")
    private String configJson;

    @Value("${firebase.project.id:veriresume-ai}")
    private String projectId;

    @Bean
    public FirebaseApp firebaseApp() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        try {
            InputStream serviceAccountStream = null;

            // 1. Check direct JSON string
            if (StringUtils.hasText(configJson)) {
                serviceAccountStream = new ByteArrayInputStream(configJson.getBytes(StandardCharsets.UTF_8));
                log.info("Initializing Firebase Admin SDK using FIREBASE_CONFIG_JSON");
            }
            // 2. Check credentials file path
            else if (StringUtils.hasText(credentialsPath) && new File(credentialsPath).exists()) {
                serviceAccountStream = new FileInputStream(credentialsPath);
                log.info("Initializing Firebase Admin SDK using file: {}", credentialsPath);
            }
            // 3. Check standard GOOGLE_APPLICATION_CREDENTIALS env var
            else {
                String googleAppCreds = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
                if (StringUtils.hasText(googleAppCreds) && new File(googleAppCreds).exists()) {
                    serviceAccountStream = new FileInputStream(googleAppCreds);
                    log.info("Initializing Firebase Admin SDK using GOOGLE_APPLICATION_CREDENTIALS");
                }
            }

            FirebaseOptions.Builder optionsBuilder = FirebaseOptions.builder();

            if (serviceAccountStream != null) {
                GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccountStream);
                optionsBuilder.setCredentials(credentials);
            } else {
                try {
                    optionsBuilder.setCredentials(GoogleCredentials.getApplicationDefault());
                    log.info("Initializing Firebase Admin SDK with Application Default credentials");
                } catch (Exception e) {
                    log.info("Initializing Firebase Admin SDK with local development credentials (project: {})", projectId);
                    // Valid in-memory token for development environments
                    GoogleCredentials devCredentials = GoogleCredentials.create(
                            new AccessToken("dev_local_access_token", new Date(System.currentTimeMillis() + 864000000L))
                    );
                    optionsBuilder.setCredentials(devCredentials);
                }
            }

            if (StringUtils.hasText(projectId)) {
                optionsBuilder.setProjectId(projectId);
            }

            return FirebaseApp.initializeApp(optionsBuilder.build());
        } catch (Exception e) {
            log.warn("FirebaseApp initialization warning: {}. Using local fallback credentials.", e.getMessage());
            FirebaseOptions fallbackOptions = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.create(new AccessToken("dev_token", new Date(System.currentTimeMillis() + 864000000L))))
                    .setProjectId(projectId)
                    .build();
            return FirebaseApp.initializeApp(fallbackOptions);
        }
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}
