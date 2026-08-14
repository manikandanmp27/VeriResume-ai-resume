package com.verita.dto.job;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyzeJobRequest {

    @NotBlank(message = "Job description is required")
    private String jobDescription;

    private String resumeId;
}
