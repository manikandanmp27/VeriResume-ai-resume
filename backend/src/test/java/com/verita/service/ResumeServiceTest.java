package com.verita.service;

import com.verita.dto.resume.CreateResumeRequest;
import com.verita.dto.resume.ResumeResponse;
import com.verita.dto.resume.ResumeSummaryDto;
import com.verita.entity.Profile;
import com.verita.entity.Resume;
import com.verita.entity.ResumeVersion;
import com.verita.entity.User;
import com.verita.entity.enums.ClaimStatus;
import com.verita.entity.enums.ResumeStatus;
import com.verita.entity.enums.Role;
import com.verita.entity.enums.TemplateType;
import com.verita.exception.ForbiddenException;
import com.verita.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResumeServiceTest {

    @Mock
    private ResumeRepository resumeRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProfileRepository profileRepository;
    @Mock
    private ResumeVersionRepository versionRepository;
    @Mock
    private ClaimRepository claimRepository;

    @InjectMocks
    private ResumeService resumeService;

    private User ownerUser;
    private User otherUser;
    private Resume sampleResume;

    @BeforeEach
    void setUp() {
        ownerUser = User.builder().id("user-1").email("owner@test.com").role(Role.ROLE_USER).build();
        otherUser = User.builder().id("user-2").email("other@test.com").role(Role.ROLE_USER).build();

        sampleResume = Resume.builder()
                .id("resume-1")
                .user(ownerUser)
                .title("Fullstack Engineer Resume")
                .targetRole("Senior Fullstack Developer")
                .selectedTemplate(TemplateType.MODERN)
                .status(ResumeStatus.DRAFT)
                .contentJson("{\"personalInfo\":{\"fullName\":\"Owner User\"}}")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should create resume, initialize v1 version snapshot, and link user profile")
    void createResume_Success() {
        CreateResumeRequest request = CreateResumeRequest.builder()
                .title("Backend Engineer Resume")
                .targetRole("Java Developer")
                .selectedTemplate(TemplateType.TECHNICAL)
                .build();

        Profile profile = Profile.builder().fullName("Owner User").email("owner@test.com").build();
        when(userRepository.findById("user-1")).thenReturn(Optional.of(ownerUser));
        when(profileRepository.findByUserId("user-1")).thenReturn(Optional.of(profile));
        when(resumeRepository.save(any(Resume.class))).thenReturn(sampleResume);
        when(versionRepository.save(any(ResumeVersion.class))).thenAnswer(i -> {
            ResumeVersion v = i.getArgument(0);
            v.setId("v1-id");
            return v;
        });

        ResumeResponse response = resumeService.createResume("user-1", request);

        assertNotNull(response);
        assertEquals("resume-1", response.getId());
        verify(resumeRepository, times(2)).save(any(Resume.class));
        verify(versionRepository).save(any(ResumeVersion.class));
    }

    @Test
    @DisplayName("Should throw ForbiddenException when user tries to access another user's resume")
    void getResume_UnauthorizedAccess_ThrowsForbidden() {
        when(resumeRepository.findById("resume-1")).thenReturn(Optional.of(sampleResume));

        assertThrows(ForbiddenException.class, () -> resumeService.getResume("resume-1", "user-2"));
    }

    @Test
    @DisplayName("Should return resume summary list with version and claim metrics")
    void listResumes_Success() {
        when(resumeRepository.findByUserIdOrderByUpdatedAtDesc("user-1")).thenReturn(List.of(sampleResume));
        when(versionRepository.countByResumeId("resume-1")).thenReturn(3L);
        when(claimRepository.countByResumeId("resume-1")).thenReturn(5L);
        when(claimRepository.countByResumeIdAndStatus("resume-1", ClaimStatus.VERIFIED)).thenReturn(4L);
        when(claimRepository.countByResumeIdAndStatus("resume-1", ClaimStatus.USER_CONFIRMED)).thenReturn(0L);
        when(claimRepository.countByResumeIdAndStatus("resume-1", ClaimStatus.UNVERIFIED)).thenReturn(1L);

        List<ResumeSummaryDto> summaries = resumeService.listResumes("user-1");

        assertNotNull(summaries);
        assertEquals(1, summaries.size());
        assertEquals(3L, summaries.get(0).getVersionCount());
        assertEquals(5L, summaries.get(0).getTotalClaimsCount());
        assertEquals(4L, summaries.get(0).getVerifiedClaimsCount());
        assertEquals(1L, summaries.get(0).getUnverifiedClaimsCount());
    }
}
