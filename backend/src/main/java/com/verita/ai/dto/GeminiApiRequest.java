package com.verita.ai.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class GeminiApiRequest {

    private List<Content> contents;
    private GenerationConfig generationConfig;

    public static GeminiApiRequest of(String prompt) {
        return GeminiApiRequest.builder()
                .contents(Collections.singletonList(
                        Content.builder()
                                .parts(Collections.singletonList(Part.builder().text(prompt).build()))
                                .build()
                ))
                .generationConfig(GenerationConfig.builder()
                        .temperature(0.2)
                        .topP(0.8)
                        .topK(40)
                        .maxOutputTokens(4096)
                        .responseMimeType("application/json")
                        .build())
                .build();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Content {
        private String role;
        private List<Part> parts;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Part {
        private String text;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GenerationConfig {
        private Double temperature;
        private Double topP;
        private Integer topK;
        private Integer maxOutputTokens;
        private String responseMimeType;
    }
}
