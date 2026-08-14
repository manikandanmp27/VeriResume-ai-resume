package com.verita.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.verita.ai.GeminiService;
import com.verita.dto.ats.ATSCheckRequest;
import com.verita.dto.ats.ATSCheckResponse;
import com.verita.entity.ATSAnalysis;
import com.verita.entity.Resume;
import com.verita.entity.User;
import com.verita.repository.ATSAnalysisRepository;
import com.verita.repository.ResumeRepository;
import com.verita.repository.ResumeVersionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ATSAnalysisServiceTest {

    @Mock
    private ATSAnalysisRepository atsAnalysisRepository;
    @Mock
    private ResumeRepository resumeRepository;
    @Mock
    private ResumeVersionRepository versionRepository;
    @Mock
    private GeminiService geminiService;

    @InjectMocks
    private ATSAnalysisService atsAnalysisService;

    private User sampleUser;
    private Resume sampleResume;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id("user-1").email("user@test.com").build();
        sampleResume = Resume.builder()
                .id("resume-1")
                .user(sampleUser)
                .contentJson("{\"personalInfo\":{\"fullName\":\"Jane Doe\",\"email\":\"jane@test.com\"}}")
                .build();
    }

    @Test
    @DisplayName("Should simulate ATS parser extraction, identify sections and return score")
    void runAtsCheck_Success() throws Exception {
        String mockAtsJson = """
        {
            "extractedText": "Jane Doe\\njane@test.com\\nSkills: Java, SQL",
            "detectedSections": ["Contact Information", "Skills"],
            "extractedSkills": ["Java", "SQL"],
            "extractedEducation": [],
            "extractedExperience": [],
            "parsingScore": 95,
            "formattingWarnings": ["Education section not detected."],
            "parsingProblems": [],
            "missingSections": ["Education", "Experience"]
        }
        """;

        when(resumeRepository.findById("resume-1")).thenReturn(Optional.of(sampleResume));
        when(geminiService.atsCheck(any())).thenReturn(new ObjectMapper().readTree(mockAtsJson));
        when(atsAnalysisRepository.save(any(ATSAnalysis.class))).thenAnswer(i -> {
            ATSAnalysis a = i.getArgument(0);
            a.setId("ats-1");
            return a;
        });

        ATSCheckResponse response = atsAnalysisService.runAtsCheck("resume-1", "user-1", new ATSCheckRequest());

        assertNotNull(response);
        assertEquals("resume-1", response.getResumeId());
        assertEquals(95, response.getParsingScore());
        assertEquals(2, response.getDetectedSections().size());
        assertTrue(response.getExtractedSkills().contains("Java"));
        assertTrue(response.getDisclaimer().contains("ATS Parsing Simulation"));
        verify(atsAnalysisRepository).save(any(ATSAnalysis.class));
    }
}
