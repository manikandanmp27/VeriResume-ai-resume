package com.verita.dto.fact;

import com.verita.entity.enums.FactCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateFactRequest {

    @NotNull(message = "Category is required")
    private FactCategory category;

    @NotBlank(message = "Raw text is required")
    private String rawText;

    private String structuredFact;

    private String sourceSection;
}
