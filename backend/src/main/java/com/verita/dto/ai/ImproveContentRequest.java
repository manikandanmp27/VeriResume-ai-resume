package com.verita.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImproveContentRequest {

    private String section; // e.g. "summary", "projects", "experience"

    @NotBlank(message = "Current text is required")
    private String currentText;

    private String context; // e.g. "Project: Parking System using Java"
}
