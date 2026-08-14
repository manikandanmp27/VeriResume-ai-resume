package com.verita.dto.resume;

import com.verita.dto.content.ResumeContentDto;
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
public class ResumeResponse {
    private String id;
    private String userId;
    private String title;
    private String targetRole;
    private TemplateType selectedTemplate;
    private ResumeStatus status;
    private ResumeContentDto content;
    private String currentVersionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
