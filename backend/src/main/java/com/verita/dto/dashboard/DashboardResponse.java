package com.verita.dto.dashboard;

import com.verita.dto.resume.ResumeSummaryDto;
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
public class DashboardResponse {
    private long totalResumes;
    private long totalVersions;
    private long totalClaims;
    private long verifiedClaims;
    private long unverifiedClaims;
    @Builder.Default
    private List<ResumeSummaryDto> recentResumes = new ArrayList<>();
    @Builder.Default
    private List<ActivityItemDto> recentActivity = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivityItemDto {
        private String id;
        private String resumeId;
        private String resumeTitle;
        private String action; // e.g. "RESUME_CREATED", "AI_GENERATED", "TAILORED", "CLAIM_VERIFIED", "EXPORTED"
        private String description;
        private LocalDateTime timestamp;
    }
}
