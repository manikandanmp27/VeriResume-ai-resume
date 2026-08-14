package com.verita.service;

import com.verita.dto.profile.ProfileDto;
import com.verita.dto.profile.ProfileUpdateRequest;
import com.verita.entity.Profile;
import com.verita.entity.User;
import com.verita.exception.ResourceNotFoundException;
import com.verita.repository.ProfileRepository;
import com.verita.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public ProfileDto getProfileByUserId(String userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(userId));
        return mapToDto(profile);
    }

    @Transactional
    public ProfileDto updateProfile(String userId, ProfileUpdateRequest request) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(userId));

        if (request.getFullName() != null) {
            profile.setFullName(request.getFullName().trim());
        }
        if (request.getEmail() != null) {
            profile.setEmail(request.getEmail().trim());
        }
        if (request.getPhone() != null) {
            profile.setPhone(request.getPhone().trim());
        }
        if (request.getLocation() != null) {
            profile.setLocation(request.getLocation().trim());
        }
        if (request.getLinkedin() != null) {
            profile.setLinkedin(request.getLinkedin().trim());
        }
        if (request.getGithub() != null) {
            profile.setGithub(request.getGithub().trim());
        }
        if (request.getPortfolio() != null) {
            profile.setPortfolio(request.getPortfolio().trim());
        }
        if (request.getProfessionalSummary() != null) {
            profile.setProfessionalSummary(request.getProfessionalSummary().trim());
        }

        Profile saved = profileRepository.save(profile);
        return mapToDto(saved);
    }

    private Profile createDefaultProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Profile profile = Profile.builder()
                .user(user)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
        return profileRepository.save(profile);
    }

    private ProfileDto mapToDto(Profile profile) {
        return ProfileDto.builder()
                .id(profile.getId())
                .userId(profile.getUser() != null ? profile.getUser().getId() : null)
                .fullName(profile.getFullName())
                .email(profile.getEmail())
                .phone(profile.getPhone())
                .location(profile.getLocation())
                .linkedin(profile.getLinkedin())
                .github(profile.getGithub())
                .portfolio(profile.getPortfolio())
                .professionalSummary(profile.getProfessionalSummary())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
