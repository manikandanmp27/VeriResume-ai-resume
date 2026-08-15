package com.verita.dto.auth;

import com.verita.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String id;
    private String firebaseUid;
    private String email;
    private String fullName;
    private Role role;
    private LocalDateTime createdAt;
}
