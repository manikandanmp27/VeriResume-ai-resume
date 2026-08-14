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
public class TailorResumeRequest {

    @NotBlank(message = "Job description is required")
    private String jobDescription;

    private String targetRole;

    private String versionName; // e.g. "Tailored - Fullstack Java Lead"
}
