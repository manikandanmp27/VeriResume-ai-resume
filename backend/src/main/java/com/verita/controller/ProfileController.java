package com.verita.controller;

import com.verita.dto.profile.ProfileDto;
import com.verita.dto.profile.ProfileUpdateRequest;
import com.verita.security.SecurityUtils;
import com.verita.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "Endpoints for managing the user's base career profile")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    @Operation(summary = "Get the current authenticated user's profile")
    public ResponseEntity<ProfileDto> getProfile() {
        String userId = SecurityUtils.getCurrentUserId();
        ProfileDto profileDto = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(profileDto);
    }

    @PutMapping
    @Operation(summary = "Update the current authenticated user's profile")
    public ResponseEntity<ProfileDto> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        ProfileDto updated = profileService.updateProfile(userId, request);
        return ResponseEntity.ok(updated);
    }
}
