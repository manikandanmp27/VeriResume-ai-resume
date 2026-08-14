package com.verita.service;

import com.verita.dto.content.PersonalInfoDto;
import com.verita.dto.content.ResumeContentDto;
import com.verita.dto.resume.CreateResumeRequest;
import com.verita.dto.resume.ResumeResponse;
import com.verita.dto.resume.ResumeSummaryDto;
import com.verita.dto.resume.UpdateResumeRequest;
import com.verita.entity.Profile;
import com.verita.entity.Resume;
import com.verita.entity.ResumeVersion;
import com.verita.entity.User;
import com.verita.entity.enums.ClaimStatus;
import com.verita.entity.enums.ResumeStatus;
import com.verita.entity.enums.VersionType;
import com.verita.exception.ForbiddenException;
import com.verita.exception.ResourceNotFoundException;
import com.verita.repository.*;
import com.verita.util.JsonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ResumeVersionRepository versionRepository;
    private final ClaimRepository claimRepository;

    @Transactional
    public ResumeResponse createResume(String userId, CreateResumeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // Build default initial content, prefilling personal info from Profile if available
        ResumeContentDto initialContent = new ResumeContentDto();
        profileRepository.findByUserId(userId).ifPresent(profile -> {
            PersonalInfoDto personalInfo = PersonalInfoDto.builder()
                    .fullName(profile.getFullName())
                    .email(profile.getEmail())
                    .phone(profile.getPhone())
                    .location(profile.getLocation())
                    .linkedin(profile.getLinkedin())
                    .github(profile.getGithub())
                    .portfolio(profile.getPortfolio())
                    .professionalSummary(profile.getProfessionalSummary())
                    .build();
            initialContent.setPersonalInfo(personalInfo);
        });

        String contentJson = JsonUtils.toJson(initialContent);

        Resume resume = Resume.builder()
                .user(user)
                .title(request.getTitle().trim())
                .targetRole(request.getTargetRole() != null ? request.getTargetRole().trim() : null)
                .selectedTemplate(request.getSelectedTemplate())
                .status(ResumeStatus.DRAFT)
                .contentJson(contentJson)
                .build();

        Resume savedResume = resumeRepository.save(resume);

        // Create initial original version snapshot (v1)
        ResumeVersion version = ResumeVersion.builder()
                .resume(savedResume)
                .versionNumber(1)
                .versionName("Initial Draft")
                .versionType(VersionType.ORIGINAL)
                .contentJson(contentJson)
                .changeSummary("Initial resume created")
                .build();
        ResumeVersion savedVersion = versionRepository.save(version);

        savedResume.setCurrentVersionId(savedVersion.getId());
        savedResume = resumeRepository.save(savedResume);

        return mapToResponse(savedResume);
    }

    @Transactional(readOnly = true)
    public ResumeResponse getResume(String resumeId, String userId) {
        Resume resume = getResumeEntity(resumeId, userId);
        return mapToResponse(resume);
    }

    @Transactional(readOnly = true)
    public List<ResumeSummaryDto> listResumes(String userId) {
        List<Resume> resumes = resumeRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        return resumes.stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ResumeResponse updateResume(String resumeId, String userId, UpdateResumeRequest request) {
        Resume resume = getResumeEntity(resumeId, userId);

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            resume.setTitle(request.getTitle().trim());
        }
        if (request.getTargetRole() != null) {
            resume.setTargetRole(request.getTargetRole().trim());
        }
        if (request.getSelectedTemplate() != null) {
            resume.setSelectedTemplate(request.getSelectedTemplate());
        }
        if (request.getStatus() != null) {
            resume.setStatus(request.getStatus());
        }

        Resume saved = resumeRepository.save(resume);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteResume(String resumeId, String userId) {
        Resume resume = getResumeEntity(resumeId, userId);
        resumeRepository.delete(resume);
    }

    public Resume getResumeEntity(String resumeId, String userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found: " + resumeId));

        if (!resume.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this resume");
        }
        return resume;
    }

    public ResumeResponse mapToResponse(Resume resume) {
        ResumeContentDto content = null;
        if (resume.getContentJson() != null && !resume.getContentJson().isBlank()) {
            content = JsonUtils.fromJson(resume.getContentJson(), ResumeContentDto.class);
        }
        if (content == null) {
            content = new ResumeContentDto();
        }

        return ResumeResponse.builder()
                .id(resume.getId())
                .userId(resume.getUser().getId())
                .title(resume.getTitle())
                .targetRole(resume.getTargetRole())
                .selectedTemplate(resume.getSelectedTemplate())
                .status(resume.getStatus())
                .content(content)
                .currentVersionId(resume.getCurrentVersionId())
                .createdAt(resume.getCreatedAt())
                .updatedAt(resume.getUpdatedAt())
                .build();
    }

    private ResumeSummaryDto mapToSummaryDto(Resume resume) {
        long versionCount = versionRepository.countByResumeId(resume.getId());
        long totalClaims = claimRepository.countByResumeId(resume.getId());
        long verifiedClaims = claimRepository.countByResumeIdAndStatus(resume.getId(), ClaimStatus.VERIFIED)
                + claimRepository.countByResumeIdAndStatus(resume.getId(), ClaimStatus.USER_CONFIRMED);
        long unverifiedClaims = claimRepository.countByResumeIdAndStatus(resume.getId(), ClaimStatus.UNVERIFIED);

        return ResumeSummaryDto.builder()
                .id(resume.getId())
                .title(resume.getTitle())
                .targetRole(resume.getTargetRole())
                .selectedTemplate(resume.getSelectedTemplate())
                .status(resume.getStatus())
                .versionCount(versionCount)
                .totalClaimsCount(totalClaims)
                .verifiedClaimsCount(verifiedClaims)
                .unverifiedClaimsCount(unverifiedClaims)
                .updatedAt(resume.getUpdatedAt())
                .createdAt(resume.getCreatedAt())
                .build();
    }
}
