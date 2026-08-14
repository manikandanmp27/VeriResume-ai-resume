package com.verita.dto.ats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ATSCheckRequest {
    private String versionId; // Optional specific version to check
}
