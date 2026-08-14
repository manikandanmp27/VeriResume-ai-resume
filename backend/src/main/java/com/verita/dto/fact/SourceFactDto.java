package com.verita.dto.fact;

import com.verita.entity.enums.FactCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SourceFactDto {
    private String id;
    private String resumeId;
    private FactCategory category;
    private String rawText;
    private String structuredFact;
    private String sourceSection;
    private LocalDateTime createdAt;
}
