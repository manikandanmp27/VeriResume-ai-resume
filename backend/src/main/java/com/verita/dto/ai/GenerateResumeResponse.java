package com.verita.dto.ai;

import com.verita.dto.claim.FactLockOverviewDto;
import com.verita.dto.content.ResumeContentDto;
import com.verita.entity.enums.ResumeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerateResumeResponse {
    private String resumeId;
    private String versionId;
    private ResumeStatus status;
    private ResumeContentDto content;
    private FactLockOverviewDto factLockOverview;
    private String message;
    private LocalDateTime generatedAt;
}
