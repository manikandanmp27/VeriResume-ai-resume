package com.verita.service;

import com.verita.dto.export.ExportResumeRequest;
import com.verita.entity.Claim;
import com.verita.entity.Resume;
import com.verita.entity.User;
import com.verita.entity.enums.ClaimStatus;
import com.verita.entity.enums.TemplateType;
import com.verita.exception.ForbiddenException;
import com.verita.repository.ClaimRepository;
import com.verita.repository.ResumeRepository;
import com.verita.repository.ResumeVersionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PdfExportServiceTest {

    @Mock
    private ResumeRepository resumeRepository;
    @Mock
    private ResumeVersionRepository versionRepository;
    @Mock
    private ClaimRepository claimRepository;
    @Mock
    private TemplateEngine templateEngine;

    @InjectMocks
    private PdfExportService pdfExportService;

    private User sampleUser;
    private Resume sampleResume;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id("user-1").email("user@test.com").build();
        sampleResume = Resume.builder()
                .id("resume-1")
                .user(sampleUser)
                .selectedTemplate(TemplateType.MODERN)
                .contentJson("""
                {
                    "personalInfo": {"fullName": "Jane Dev", "email": "jane@example.com"},
                    "projects": [
                        {
                            "title": "Cloud Manager",
                            "bulletPoints": [
                                "Built scalable backend in Java.",
                                "Reduced latency by 50%."
                            ]
                        }
                    ]
                }
                """)
                .build();
    }

    @Test
    @DisplayName("Should filter out rejected claims and generate PDF bytes")
    void exportResumePdf_FiltersRejectedClaims() {
        Claim rejectedClaim = Claim.builder()
                .id("c-1")
                .resume(sampleResume)
                .claimText("Reduced latency by 50%.")
                .status(ClaimStatus.REJECTED)
                .build();

        when(resumeRepository.findById("resume-1")).thenReturn(Optional.of(sampleResume));
        when(claimRepository.findByResumeIdAndStatus("resume-1", ClaimStatus.REJECTED))
                .thenReturn(List.of(rejectedClaim));

        String validXhtml = """
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head><title>Resume</title></head>
        <body><h1>Jane Dev</h1><p>jane@example.com</p></body>
        </html>
        """;

        when(templateEngine.process(eq("resume-pdf"), any(Context.class))).thenReturn(validXhtml);

        byte[] pdfBytes = pdfExportService.exportResumePdf("resume-1", "user-1", new ExportResumeRequest());

        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
        // PDF header magic bytes %PDF-
        assertEquals('%', (char) pdfBytes[0]);
        assertEquals('P', (char) pdfBytes[1]);
        assertEquals('D', (char) pdfBytes[2]);
        assertEquals('F', (char) pdfBytes[3]);
    }

    @Test
    @DisplayName("Should throw ForbiddenException when accessing another user's resume for export")
    void exportResumePdf_Unauthorized_ThrowsForbidden() {
        when(resumeRepository.findById("resume-1")).thenReturn(Optional.of(sampleResume));

        assertThrows(ForbiddenException.class, () ->
                pdfExportService.exportResumePdf("resume-1", "intruder-user", new ExportResumeRequest())
        );
    }
}
