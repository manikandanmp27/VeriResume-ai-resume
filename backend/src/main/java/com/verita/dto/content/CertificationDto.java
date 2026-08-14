package com.verita.dto.content;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificationDto {
    private String id;
    private String name;
    private String issuer;
    private String issueDate;
    private String expiryDate;
    private String credentialUrl;
}
