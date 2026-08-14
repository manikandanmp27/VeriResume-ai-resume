package com.verita.dto.resume;

import com.verita.entity.enums.ResumeStatus;
import com.verita.entity.enums.TemplateType;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateResumeRequest {

    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @Size(max = 255, message = "Target role cannot exceed 255 characters")
    private String targetRole;

    private TemplateType selectedTemplate;

    private ResumeStatus status;
}
