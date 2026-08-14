package com.verita.dto.fact;

import com.verita.entity.enums.FactCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateFactRequest {
    private FactCategory category;
    private String rawText;
    private String structuredFact;
    private String sourceSection;
}
