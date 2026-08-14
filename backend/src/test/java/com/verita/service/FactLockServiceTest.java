package com.verita.service;

import com.verita.dto.claim.ClaimDto;
import com.verita.dto.claim.FactLockOverviewDto;
import com.verita.dto.content.PersonalInfoDto;
import com.verita.dto.content.ProjectDto;
import com.verita.dto.content.ResumeContentDto;
import com.verita.entity.Claim;
import com.verita.entity.Resume;
import com.verita.entity.SourceFact;
import com.verita.entity.User;
import com.verita.entity.enums.ClaimStatus;
import com.verita.entity.enums.FactCategory;
import com.verita.repository.ClaimRepository;
import com.verita.repository.ResumeRepository;
import com.verita.repository.SourceFactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FactLockServiceTest {

    @Mock
    private ClaimRepository claimRepository;
    @Mock
    private ResumeRepository resumeRepository;
    @Mock
    private SourceFactRepository sourceFactRepository;
    @Mock
    private SourceFactService sourceFactService;

    @InjectMocks
    private FactLockService factLockService;

    private User sampleUser;
    private Resume sampleResume;
    private SourceFact sampleFact;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id("user-1").email("user@test.com").build();
        sampleResume = Resume.builder().id("resume-1").user(sampleUser).title("Test Resume").build();
        sampleFact = SourceFact.builder()
                .id("fact-1")
                .resume(sampleResume)
                .category(FactCategory.PROJECT)
                .rawText("I built a Java parking management system using SQLite")
                .structuredFact("Project: Parking System with Java and SQLite")
                .build();
    }

    @Test
    @DisplayName("Should flag hallucinated metric as UNVERIFIED while marking grounded fact as VERIFIED")
    void extractAndVerifyClaims_AntiHallucination() {
        ResumeContentDto content = new ResumeContentDto();
        ProjectDto project = ProjectDto.builder()
                .title("Parking Management System")
                .technologies(List.of("Java", "SQLite"))
                .bulletPoints(List.of(
                        "Developed a parking management system using Java and SQLite.",
                        "Reduced parking allocation time by 40%." // Fabricated metric unsupported by facts
                ))
                .build();
        content.setProjects(List.of(project));

        when(sourceFactRepository.findByResumeIdOrderByCreatedAtAsc("resume-1")).thenReturn(List.of(sampleFact));
        when(claimRepository.saveAll(anyList())).thenAnswer(i -> i.getArgument(0));

        List<Claim> claims = factLockService.extractAndVerifyClaims(sampleResume, "v1", content);

        assertNotNull(claims);
        assertEquals(2, claims.size());

        // Grounded bullet point
        Claim verifiedClaim = claims.stream().filter(c -> c.getClaimText().contains("Developed a parking")).findFirst().orElseThrow();
        assertEquals(ClaimStatus.VERIFIED, verifiedClaim.getStatus());
        assertFalse(verifiedClaim.getSupportingFacts().isEmpty());

        // Fabricated metric bullet point
        Claim unverifiedClaim = claims.stream().filter(c -> c.getClaimText().contains("Reduced parking allocation time by 40%")).findFirst().orElseThrow();
        assertEquals(ClaimStatus.UNVERIFIED, unverifiedClaim.getStatus());
        assertTrue(unverifiedClaim.getJustification().contains("without direct user-provided evidence"));
    }

    @Test
    @DisplayName("Should allow user to confirm and verify an unverified claim")
    void verifyClaim_Success() {
        Claim unverifiedClaim = Claim.builder()
                .id("claim-1")
                .resume(sampleResume)
                .claimText("Reduced parking allocation time by 40%.")
                .section("Projects")
                .status(ClaimStatus.UNVERIFIED)
                .build();

        when(resumeRepository.findById("resume-1")).thenReturn(Optional.of(sampleResume));
        when(claimRepository.findByIdAndResumeId("claim-1", "resume-1")).thenReturn(Optional.of(unverifiedClaim));
        when(claimRepository.save(any(Claim.class))).thenAnswer(i -> i.getArgument(0));

        ClaimDto result = factLockService.verifyClaim("resume-1", "claim-1", "user-1");

        assertNotNull(result);
        assertEquals(ClaimStatus.USER_CONFIRMED, result.getStatus());
        assertEquals("Confirmed and approved by user", result.getJustification());
    }

    @Test
    @DisplayName("Should allow user to reject a claim")
    void rejectClaim_Success() {
        Claim unverifiedClaim = Claim.builder()
                .id("claim-1")
                .resume(sampleResume)
                .claimText("Reduced parking allocation time by 40%.")
                .section("Projects")
                .status(ClaimStatus.UNVERIFIED)
                .build();

        when(resumeRepository.findById("resume-1")).thenReturn(Optional.of(sampleResume));
        when(claimRepository.findByIdAndResumeId("claim-1", "resume-1")).thenReturn(Optional.of(unverifiedClaim));
        when(claimRepository.save(any(Claim.class))).thenAnswer(i -> i.getArgument(0));

        ClaimDto result = factLockService.rejectClaim("resume-1", "claim-1", "user-1");

        assertNotNull(result);
        assertEquals(ClaimStatus.REJECTED, result.getStatus());
    }

    @Test
    @DisplayName("Should compute overview verification percentage accurately")
    void getClaimsOverview_CalculatesMetrics() {
        Claim c1 = Claim.builder().id("1").resume(sampleResume).section("s").claimText("t1").status(ClaimStatus.VERIFIED).build();
        Claim c2 = Claim.builder().id("2").resume(sampleResume).section("s").claimText("t2").status(ClaimStatus.USER_CONFIRMED).build();
        Claim c3 = Claim.builder().id("3").resume(sampleResume).section("s").claimText("t3").status(ClaimStatus.UNVERIFIED).build();
        Claim c4 = Claim.builder().id("4").resume(sampleResume).section("s").claimText("t4").status(ClaimStatus.REJECTED).build();

        when(resumeRepository.findById("resume-1")).thenReturn(Optional.of(sampleResume));
        when(claimRepository.findByResumeIdOrderByCreatedAtAsc("resume-1")).thenReturn(List.of(c1, c2, c3, c4));

        FactLockOverviewDto overview = factLockService.getClaimsOverview("resume-1", "user-1");

        assertNotNull(overview);
        assertEquals(4, overview.getTotalClaims());
        assertEquals(1, overview.getVerifiedCount());
        assertEquals(1, overview.getUserConfirmedCount());
        assertEquals(1, overview.getUnverifiedCount());
        assertEquals(1, overview.getRejectedCount());
        assertEquals(50.0, overview.getVerificationPercentage()); // (1+1)/4 * 100
    }
}
