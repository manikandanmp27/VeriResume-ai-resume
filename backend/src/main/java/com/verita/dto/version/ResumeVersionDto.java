package com.verita.dto.version;

import com.verita.dto.content.ResumeContentDto;
import com.verita.entity.enums.VersionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeVersionDto {
    private String id;
    private String resumeId;
    private Integer versionNumber;
    private String versionName;
    private VersionType versionType;
    private ResumeContentDto content;
    private String changeSummary;
    private LocalDateTime createdAt;
}
