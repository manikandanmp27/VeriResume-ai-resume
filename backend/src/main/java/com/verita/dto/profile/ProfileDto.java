package com.verita.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {
    private String id;
    private String userId;
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String linkedin;
    private String github;
    private String portfolio;
    private String professionalSummary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
