package com.verita.dto.job;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeMatchResponse {
    private String resumeId;
    @Builder.Default
    private List<String> matchingSkills = new ArrayList<>();
    @Builder.Default
    private List<String> matchingTechnologies = new ArrayList<>();
    @Builder.Default
    private List<String> matchingExperience = new ArrayList<>();
    @Builder.Default
    private List<String> missingRequirements = new ArrayList<>();
    @Builder.Default
    private List<String> relevantResumeSections = new ArrayList<>();
    @Builder.Default
    private List<String> improvementSuggestions = new ArrayList<>();
    private Integer internalMatchIndicator; // 0-100 internal matching indicator
    private String matchSummary;
}
