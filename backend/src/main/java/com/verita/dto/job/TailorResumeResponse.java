package com.verita.dto.job;

import com.verita.dto.content.ResumeContentDto;
import com.verita.dto.version.VersionDiffResponse;
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
public class TailorResumeResponse {
    private String resumeId;
    private String versionId;
    private Integer versionNumber;
    private String versionName;
    private String changeSummary;
    @Builder.Default
    private List<VersionDiffResponse.DiffItem> changes = new ArrayList<>();
    private ResumeContentDto tailoredContent;
    private LocalDateTime createdAt;
}
