package com.verita.dto.claim;

import com.verita.dto.fact.SourceFactDto;
import com.verita.entity.enums.ClaimStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimDto {
    private String id;
    private String resumeId;
    private String versionId;
    private String claimText;
    private String section;
    private ClaimStatus status;
    private String justification;
    private Double confidenceScore;
    @Builder.Default
    private List<SourceFactDto> supportingFacts = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
