package com.verita.dto.ats;

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
public class ATSCheckResponse {
    private String id;
    private String resumeId;
    private String versionId;
    private String extractedText;
    @Builder.Default
    private List<String> detectedSections = new ArrayList<>();
    @Builder.Default
    private List<String> extractedSkills = new ArrayList<>();
    @Builder.Default
    private List<String> extractedEducation = new ArrayList<>();
    @Builder.Default
    private List<String> extractedExperience = new ArrayList<>();
    private Integer parsingScore;
    @Builder.Default
    private List<String> formattingWarnings = new ArrayList<>();
    @Builder.Default
    private List<String> parsingProblems = new ArrayList<>();
    @Builder.Default
    private List<String> missingSections = new ArrayList<>();
    @Builder.Default
    private String disclaimer = "ATS Parsing Simulation — Helps identify automated parsing and formatting risks. Not an official endorsement by any third-party ATS.";
    private LocalDateTime checkedAt;
}
