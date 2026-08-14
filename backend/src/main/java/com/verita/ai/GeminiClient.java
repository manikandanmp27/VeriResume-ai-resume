package com.verita.ai;

import com.verita.ai.dto.GeminiApiRequest;
import com.verita.ai.dto.GeminiApiResponse;
import com.verita.exception.AiServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
public class GeminiClient {

    private final RestClient restClient;
    private final String apiKey;
    private final String baseUrl;
    private final String model;

    public GeminiClient(
            RestClient.Builder restClientBuilder,
            @Value("${gemini.api.key:}") String apiKey,
            @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models}") String baseUrl,
            @Value("${gemini.model:gemini-1.5-flash}") String model
    ) {
        this.restClient = restClientBuilder.build();
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.model = model;
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && !apiKey.equalsIgnoreCase("none");
    }

    public GeminiApiResponse generateContent(String prompt) {
        if (!isConfigured()) {
            throw new AiServiceException("Gemini API key is not configured");
        }

        String url = String.format("%s/%s:generateContent?key=%s", baseUrl, model, apiKey);

        GeminiApiRequest request = GeminiApiRequest.of(prompt);

        try {
            return restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(GeminiApiResponse.class);
        } catch (Exception e) {
            log.error("Gemini API invocation failed: {}", e.getMessage(), e);
            throw new AiServiceException("Gemini AI service error: " + e.getMessage(), e);
        }
    }
}
