package com.verita.dto.claim;

import com.verita.entity.enums.ClaimStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateClaimRequest {
    private String claimText;
    private ClaimStatus status;
    private String justification;
    private List<String> supportingFactIds;
}
