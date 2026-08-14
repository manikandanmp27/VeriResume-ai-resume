package com.verita.dto.export;

import com.verita.entity.enums.TemplateType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExportResumeRequest {
    private String versionId;
    private TemplateType templateType;
}
