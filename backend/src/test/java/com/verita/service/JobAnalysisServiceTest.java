package com.verita.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.verita.ai.GeminiService;
import com.verita.dto.content.PersonalInfoDto;
import com.verita.dto.content.ResumeContentDto;
import com.verita.dto.job.AnalyzeJobRequest;
import com.verita.dto.job.JobAnalysisResponse;
import com.verita.dto.job.TailorResumeRequest;
import com.verita.dto.job.TailorResumeResponse;
import com.verita.entity.JobAnalysis;
import com.verita.entity.Resume;
import com.verita.entity.ResumeVersion;
import com.verita.entity.User;
import com.verita.entity.enums.ResumeStatus;
import com.verita.entity.enums.VersionType;
import com.verita.repository.*;
import com.verita.util.JsonUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobAnalysisServiceTest {

    @Mock
    private JobAnalysisRepository jobAnalysisRepository;
    @Mock
    private ResumeRepository resumeRepository;
    @Mock
    private ResumeVersionRepository versionRepository;
    @Mock
    private SourceFactRepository sourceFactRepository;
    @Mock
    private ProfileRepository profileRepository;
    @Mock
    private GeminiService geminiService;
    @Mock
    private ResumeVersionService resumeVersionService;

    @InjectMocks
    private JobAnalysisService jobAnalysisService;

    private User sampleUser;
    private Resume sampleResume;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id("user-1").email("user@test.com").build();
        sampleResume = Resume.builder()
                .id("resume-1")
                .user(sampleUser)
                .title("Software Engineer")
                .targetRole("Backend Engineer")
                .status(ResumeStatus.DRAFT)
                .contentJson("{\"personalInfo\":{\"fullName\":\"Alex Dev\"}}")
                .build();
    }

    @Test
    @DisplayName("Should analyze job description and return structured requirements and match score")
    void analyzeJob_Success() throws Exception {
        AnalyzeJobRequest request = AnalyzeJobRequest.builder()
                .jobDescription("Looking for a Senior Java Developer with Spring Boot, PostgreSQL, and Docker experience.")
                .resumeId("resume-1")
                .build();

        String mockAiJson = """
        {
            "jobTitle": "Senior Java Developer",
            "company": "Tech Corp",
            "importantSkills": ["Java", "Spring Boot", "PostgreSQL", "Docker"],
            "technologies": ["Java", "Spring Boot", "PostgreSQL"],
            "qualifications": ["Bachelor's in Computer Science"],
            "requirements": ["5+ years experience", "Microservices architecture"],
            "supportedRequirements": ["Java", "Spring Boot"],
            "missingRequirements": ["Docker", "Kubernetes"],
            "matchScore": 85
        }
        """;

        when(resumeRepository.findById("resume-1")).thenReturn(Optional.of(sampleResume));
        when(sourceFactRepository.findByResumeIdOrderByCreatedAtAsc("resume-1")).thenReturn(List.of());
        when(geminiService.analyzeJobDescription(any(), any(), any()))
                .thenReturn(new ObjectMapper().readTree(mockAiJson));
        when(jobAnalysisRepository.save(any(JobAnalysis.class))).thenAnswer(i -> {
            JobAnalysis ja = i.getArgument(0);
            ja.setId("analysis-1");
            return ja;
        });

        JobAnalysisResponse response = jobAnalysisService.analyzeJob("user-1", request);

        assertNotNull(response);
        assertEquals("Senior Java Developer", response.getJobTitle());
        assertEquals("Tech Corp", response.getCompany());
        assertEquals(85, response.getMatchScore());
        assertEquals(4, response.getImportantSkills().size());
        verify(jobAnalysisRepository).save(any(JobAnalysis.class));
    }

    @Test
    @DisplayName("Should tailor resume and create a new ResumeVersion preserving original version")
    void tailorResume_PreservesOriginalVersion() throws Exception {
        TailorResumeRequest request = TailorResumeRequest.builder()
                .jobDescription("Target role: Senior Java Architect")
                .targetRole("Senior Java Architect")
                .versionName("Tailored - Java Architect")
                .build();

        ResumeContentDto tailoredDto = new ResumeContentDto();
        tailoredDto.setPersonalInfo(PersonalInfoDto.builder().fullName("Alex Dev").professionalSummary("Senior Java Architect with deep expertise").build());

        String tailorAiJson = String.format("""
        {
            "tailoredContent": %s,
            "changeSummary": "Tailored summary to align with Senior Java Architect requirements."
        }
        """, JsonUtils.toJson(tailoredDto));

        when(resumeRepository.findById("resume-1")).thenReturn(Optional.of(sampleResume));
        when(sourceFactRepository.findByResumeIdOrderByCreatedAtAsc("resume-1")).thenReturn(List.of());
        when(geminiService.tailorResume(any(), any(), any(), any()))
                .thenReturn(new ObjectMapper().readTree(tailorAiJson));
        when(versionRepository.countByResumeId("resume-1")).thenReturn(1L);
        when(versionRepository.save(any(ResumeVersion.class))).thenAnswer(i -> {
            ResumeVersion v = i.getArgument(0);
            v.setId("v2-id");
            return v;
        });
        when(resumeRepository.save(any(Resume.class))).thenReturn(sampleResume);

        TailorResumeResponse response = jobAnalysisService.tailorResume("resume-1", "user-1", request);

        assertNotNull(response);
        assertEquals("v2-id", response.getVersionId());
        assertEquals(2, response.getVersionNumber());
        assertEquals(ResumeStatus.TAILORED, sampleResume.getStatus());
        verify(versionRepository).save(any(ResumeVersion.class));
    }
}
