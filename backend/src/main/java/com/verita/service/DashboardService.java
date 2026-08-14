package com.verita.service;

import com.verita.dto.dashboard.DashboardResponse;
import com.verita.dto.resume.ResumeSummaryDto;
import com.verita.entity.Resume;
import com.verita.entity.ResumeVersion;
import com.verita.entity.enums.ClaimStatus;
import com.verita.repository.ClaimRepository;
import com.verita.repository.ResumeRepository;
import com.verita.repository.ResumeVersionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ResumeRepository resumeRepository;
    private final ResumeVersionRepository versionRepository;
    private final ClaimRepository claimRepository;
    private final ResumeService resumeService;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboardData(String userId) {
        long totalResumes = resumeRepository.countByUserId(userId);
        List<ResumeSummaryDto> recentResumes = resumeService.listResumes(userId);

        long totalVersions = 0;
        long totalClaims = 0;
        long verifiedClaims = 0;
        long unverifiedClaims = 0;

        List<DashboardResponse.ActivityItemDto> activities = new ArrayList<>();

        for (ResumeSummaryDto resume : recentResumes) {
            totalVersions += resume.getVersionCount();
            totalClaims += resume.getTotalClaimsCount();
            verifiedClaims += resume.getVerifiedClaimsCount();
            unverifiedClaims += resume.getUnverifiedClaimsCount();

            // Build recent activities based on resumes and versions
            activities.add(DashboardResponse.ActivityItemDto.builder()
                    .id(resume.getId())
                    .resumeId(resume.getId())
                    .resumeTitle(resume.getTitle())
                    .action(resume.getStatus().name())
                    .description("Resume '" + resume.getTitle() + "' updated (" + resume.getStatus() + ")")
                    .timestamp(resume.getUpdatedAt())
                    .build());
        }

        // Sort activities by timestamp descending and take top 10
        activities.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        if (activities.size() > 10) {
            activities = activities.subList(0, 10);
        }

        return DashboardResponse.builder()
                .totalResumes(totalResumes)
                .totalVersions(totalVersions)
                .totalClaims(totalClaims)
                .verifiedClaims(verifiedClaims)
                .unverifiedClaims(unverifiedClaims)
                .recentResumes(recentResumes.size() > 5 ? recentResumes.subList(0, 5) : recentResumes)
                .recentActivity(activities)
                .build();
    }
}
