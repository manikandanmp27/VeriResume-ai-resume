package com.verita.dto.job;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobAnalysisResponse {
    private String id;
    private String resumeId;
    private String jobTitle;
    private String company;
    @Builder.Default
    private List<String> importantSkills = new ArrayList<>();
    @Builder.Default
    private List<String> technologies = new ArrayList<>();
    @Builder.Default
    private List<String> qualifications = new ArrayList<>();
    @Builder.Default
    private List<String> requirements = new ArrayList<>();
    @Builder.Default
    private List<String> supportedRequirements = new ArrayList<>();
    @Builder.Default
    private List<String> missingRequirements = new ArrayList<>();
    private Integer matchScore;
    private LocalDateTime createdAt;
}
