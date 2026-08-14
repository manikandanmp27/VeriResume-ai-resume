package com.verita.dto.profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {
    @Size(max = 255, message = "Full name cannot exceed 255 characters")
    private String fullName;

    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 50, message = "Phone cannot exceed 50 characters")
    private String phone;

    @Size(max = 255, message = "Location cannot exceed 255 characters")
    private String location;

    @Size(max = 500, message = "LinkedIn URL cannot exceed 500 characters")
    private String linkedin;

    @Size(max = 500, message = "GitHub URL cannot exceed 500 characters")
    private String github;

    @Size(max = 500, message = "Portfolio URL cannot exceed 500 characters")
    private String portfolio;

    private String professionalSummary;
}
