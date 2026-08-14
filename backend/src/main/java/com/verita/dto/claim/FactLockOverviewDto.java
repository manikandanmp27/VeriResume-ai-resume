package com.verita.dto.claim;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactLockOverviewDto {
    private String resumeId;
    private long totalClaims;
    private long verifiedCount;
    private long unverifiedCount;
    private long rejectedCount;
    private long userConfirmedCount;
    private double verificationPercentage;
    @Builder.Default
    private List<ClaimDto> claims = new ArrayList<>();
}
