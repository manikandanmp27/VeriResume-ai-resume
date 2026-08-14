package com.verita.dto.version;

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
public class VersionDiffResponse {
    private String baseVersionId;
    private String baseVersionName;
    private String compareVersionId;
    private String compareVersionName;
    private String overallSummary;
    @Builder.Default
    private List<DiffItem> differences = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DiffItem {
        private String section; // e.g. "Summary", "Experience", "Projects", "Skills"
        private String itemTitle; // e.g. "Parking Management System", "Java Skill Category"
        private String changeType; // "ADDED", "REMOVED", "MODIFIED", "REORDERED"
        private String original;
        private String changed;
        private String reason;
    }
}
