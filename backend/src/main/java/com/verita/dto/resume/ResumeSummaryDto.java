package com.verita.dto.resume;

import com.verita.entity.enums.ResumeStatus;
import com.verita.entity.enums.TemplateType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeSummaryDto {
    private String id;
    private String title;
    private String targetRole;
    private TemplateType selectedTemplate;
    private ResumeStatus status;
    private long versionCount;
    private long totalClaimsCount;
    private long verifiedClaimsCount;
    private long unverifiedClaimsCount;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
}
