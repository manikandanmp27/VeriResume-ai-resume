package com.verita;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.verita.dto.ai.GenerateResumeResponse;
import com.verita.dto.ai.ImproveContentRequest;
import com.verita.dto.ai.ImproveContentResponse;
import com.verita.dto.ats.ATSCheckRequest;
import com.verita.dto.ats.ATSCheckResponse;
import com.verita.dto.auth.AuthResponse;
import com.verita.dto.auth.RegisterRequest;
import com.verita.dto.claim.ClaimDto;
import com.verita.dto.claim.FactLockOverviewDto;
import com.verita.dto.content.*;
import com.verita.dto.dashboard.DashboardResponse;
import com.verita.dto.export.ExportResumeRequest;
import com.verita.dto.job.*;
import com.verita.dto.profile.ProfileDto;
import com.verita.dto.profile.ProfileUpdateRequest;
import com.verita.dto.resume.CreateResumeRequest;
import com.verita.dto.resume.ResumeResponse;
import com.verita.dto.resume.ResumeSummaryDto;
import com.verita.dto.template.TemplateDto;
import com.verita.dto.version.ResumeVersionDto;
import com.verita.dto.version.VersionDiffResponse;
import com.verita.entity.enums.ClaimStatus;
import com.verita.entity.enums.TemplateType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class VeritaFullWorkflowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Complete Canonical Verita End-to-End Workflow Integration Test")
    void testCompleteVeritaWorkflow() throws Exception {
        // ==========================================
        // 1. REGISTER USER & GET JWT TOKEN
        // ==========================================
        RegisterRequest registerReq = RegisterRequest.builder()
                .email("alex.dev@example.com")
                .password("securePassword123")
                .fullName("Alex Mercer")
                .build();

        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andReturn();

        AuthResponse auth = objectMapper.readValue(regResult.getResponse().getContentAsString(), AuthResponse.class);
        assertNotNull(auth.getToken());
        String token = "Bearer " + auth.getToken();

        // ==========================================
        // 2. GET & UPDATE USER PROFILE
        // ==========================================
        ProfileUpdateRequest profileReq = ProfileUpdateRequest.builder()
                .fullName("Alex Mercer")
                .email("alex.dev@example.com")
                .phone("+1 555-0199")
                .location("San Francisco, CA")
                .linkedin("https://linkedin.com/in/alexmercer")
                .github("https://github.com/alexmercer")
                .portfolio("https://alexmercer.dev")
                .professionalSummary("Fullstack engineer with 4+ years of building distributed web systems.")
                .build();

        MvcResult profResult = mockMvc.perform(put("/api/profile")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profileReq)))
                .andExpect(status().isOk())
                .andReturn();

        ProfileDto profile = objectMapper.readValue(profResult.getResponse().getContentAsString(), ProfileDto.class);
        assertEquals("Alex Mercer", profile.getFullName());
        assertEquals("San Francisco, CA", profile.getLocation());

        // ==========================================
        // 3. CREATE A NEW RESUME
        // ==========================================
        CreateResumeRequest resumeReq = CreateResumeRequest.builder()
                .title("Fullstack Software Engineer 2026")
                .targetRole("Senior Fullstack Developer")
                .selectedTemplate(TemplateType.MODERN)
                .build();

        MvcResult resumeResult = mockMvc.perform(post("/api/resumes")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resumeReq)))
                .andExpect(status().isCreated())
                .andReturn();

        ResumeResponse resume = objectMapper.readValue(resumeResult.getResponse().getContentAsString(), ResumeResponse.class);
        assertNotNull(resume.getId());
        String resumeId = resume.getId();

        // ==========================================
        // 4. ADD RESUME SECTIONS (Education, Skills, Projects, Experience)
        // ==========================================
        // Skills
        List<SkillCategoryDto> skills = List.of(
                SkillCategoryDto.builder().category("Programming Languages").skills(List.of("Java", "TypeScript", "Python", "SQL")).build(),
                SkillCategoryDto.builder().category("Frameworks").skills(List.of("Spring Boot", "React", "Node.js")).build(),
                SkillCategoryDto.builder().category("Databases & Tools").skills(List.of("PostgreSQL", "Docker", "Git", "Redis")).build()
        );
        mockMvc.perform(put("/api/resumes/" + resumeId + "/skills")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(skills)))
                .andExpect(status().isOk());

        // Projects (natural language description)
        List<ProjectDto> projects = List.of(
                ProjectDto.builder()
                        .title("Parking Management System")
                        .role("Lead Developer")
                        .technologies(List.of("Java", "Spring Boot", "PostgreSQL"))
                        .naturalDescription("I built a real-time parking spot reservation platform using Java and PostgreSQL to manage vehicle check-ins.")
                        .build(),
                ProjectDto.builder()
                        .title("AI Resume Assistant")
                        .role("Creator")
                        .technologies(List.of("React", "TypeScript", "Tailwind CSS"))
                        .naturalDescription("Developed an interactive frontend for resume generation with claim verification.")
                        .build()
        );
        mockMvc.perform(put("/api/resumes/" + resumeId + "/projects")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projects)))
                .andExpect(status().isOk());

        // Experience
        List<ExperienceDto> experience = List.of(
                ExperienceDto.builder()
                        .company("Nexlify Solutions")
                        .position("Software Engineer")
                        .location("San Francisco, CA")
                        .startDate("2022")
                        .endDate("Present")
                        .current(true)
                        .naturalDescription("I worked on microservices in Spring Boot, optimized REST APIs, and managed PostgreSQL databases.")
                        .build()
        );
        mockMvc.perform(put("/api/resumes/" + resumeId + "/experience")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(experience)))
                .andExpect(status().isOk());

        // Education
        List<EducationDto> education = List.of(
                EducationDto.builder()
                        .institution("University of California, Berkeley")
                        .degree("B.S. in Computer Science")
                        .startDate("2018")
                        .endDate("2022")
                        .gradeOrCgpa("3.8 / 4.0")
                        .coursework(List.of("Data Structures", "Distributed Systems", "Database Design"))
                        .build()
        );
        mockMvc.perform(put("/api/resumes/" + resumeId + "/education")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(education)))
                .andExpect(status().isOk());

        // ==========================================
        // 5. GENERATE AI RESUME & FACT LOCK CLAIMS
        // ==========================================
        MvcResult genResult = mockMvc.perform(post("/api/resumes/" + resumeId + "/generate")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andReturn();

        GenerateResumeResponse genResponse = objectMapper.readValue(genResult.getResponse().getContentAsString(), GenerateResumeResponse.class);
        assertNotNull(genResponse.getFactLockOverview());
        assertFalse(genResponse.getFactLockOverview().getClaims().isEmpty());

        // ==========================================
        // 6. FACT LOCK REVIEW & VERIFICATION
        // ==========================================
        MvcResult claimsResult = mockMvc.perform(get("/api/resumes/" + resumeId + "/claims")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andReturn();

        FactLockOverviewDto claimsOverview = objectMapper.readValue(claimsResult.getResponse().getContentAsString(), FactLockOverviewDto.class);
        assertTrue(claimsOverview.getTotalClaims() > 0);

        ClaimDto firstClaim = claimsOverview.getClaims().get(0);
        // Verify claim
        mockMvc.perform(post("/api/resumes/" + resumeId + "/claims/" + firstClaim.getId() + "/verify")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("USER_CONFIRMED"));

        // ==========================================
        // 7. IMPROVE SPECIFIC CONTENT (AI IMPROVEMENT)
        // ==========================================
        ImproveContentRequest improveReq = ImproveContentRequest.builder()
                .section("projects")
                .currentText("I built a real-time parking spot reservation platform.")
                .context("Project: Parking System")
                .build();

        MvcResult improveResult = mockMvc.perform(post("/api/resumes/" + resumeId + "/improve")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(improveReq)))
                .andExpect(status().isOk())
                .andReturn();

        ImproveContentResponse improveResponse = objectMapper.readValue(improveResult.getResponse().getContentAsString(), ImproveContentResponse.class);
        assertNotNull(improveResponse.getImprovedText());

        // ==========================================
        // 8. JOB DESCRIPTION ANALYSIS
        // ==========================================
        String jobDescription = """
        Senior Backend Engineer Wanted!
        Requirements:
        - 4+ years of Java and Spring Boot experience.
        - Experience with PostgreSQL and Docker.
        - Solid understanding of REST API design and distributed caching with Redis.
        - Strong communication skills.
        """;

        AnalyzeJobRequest jobReq = AnalyzeJobRequest.builder()
                .jobDescription(jobDescription)
                .resumeId(resumeId)
                .build();

        MvcResult jobResult = mockMvc.perform(post("/api/jobs/analyze")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(jobReq)))
                .andExpect(status().isOk())
                .andReturn();

        JobAnalysisResponse jobAnalysis = objectMapper.readValue(jobResult.getResponse().getContentAsString(), JobAnalysisResponse.class);
        assertNotNull(jobAnalysis.getImportantSkills());
        assertTrue(jobAnalysis.getMatchScore() > 0);

        // ==========================================
        // 9. RESUME MATCHING
        // ==========================================
        ResumeMatchRequest matchReq = ResumeMatchRequest.builder()
                .jobDescription(jobDescription)
                .build();

        MvcResult matchResult = mockMvc.perform(post("/api/resumes/" + resumeId + "/match")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(matchReq)))
                .andExpect(status().isOk())
                .andReturn();

        ResumeMatchResponse matchResponse = objectMapper.readValue(matchResult.getResponse().getContentAsString(), ResumeMatchResponse.class);
        assertNotNull(matchResponse.getInternalMatchIndicator());
        assertFalse(matchResponse.getMatchingSkills().isEmpty());

        // ==========================================
        // 10. RESUME TAILORING (Creates New Version Snapshot)
        // ==========================================
        TailorResumeRequest tailorReq = TailorResumeRequest.builder()
                .jobDescription(jobDescription)
                .targetRole("Senior Backend Engineer")
                .versionName("Tailored - Senior Backend")
                .build();

        MvcResult tailorResult = mockMvc.perform(post("/api/resumes/" + resumeId + "/tailor")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tailorReq)))
                .andExpect(status().isOk())
                .andReturn();

        TailorResumeResponse tailorResponse = objectMapper.readValue(tailorResult.getResponse().getContentAsString(), TailorResumeResponse.class);
        assertNotNull(tailorResponse.getVersionId());
        assertEquals("Tailored - Senior Backend", tailorResponse.getVersionName());

        // ==========================================
        // 11. VERSION DIFF VIEW
        // ==========================================
        MvcResult diffResult = mockMvc.perform(get("/api/resumes/" + resumeId + "/versions/" + tailorResponse.getVersionId() + "/diff")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andReturn();

        VersionDiffResponse diffResponse = objectMapper.readValue(diffResult.getResponse().getContentAsString(), VersionDiffResponse.class);
        assertNotNull(diffResponse.getBaseVersionId());
        assertNotNull(diffResponse.getCompareVersionId());

        // ==========================================
        // 12. ATS REALITY CHECK SIMULATION
        // ==========================================
        MvcResult atsResult = mockMvc.perform(post("/api/resumes/" + resumeId + "/ats-check")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ATSCheckRequest())))
                .andExpect(status().isOk())
                .andReturn();

        ATSCheckResponse atsCheck = objectMapper.readValue(atsResult.getResponse().getContentAsString(), ATSCheckResponse.class);
        assertNotNull(atsCheck.getParsingScore());
        assertNotNull(atsCheck.getExtractedText());
        assertFalse(atsCheck.getDetectedSections().isEmpty());

        // ==========================================
        // 13. TEMPLATES API
        // ==========================================
        MvcResult tmplResult = mockMvc.perform(get("/api/templates"))
                .andExpect(status().isOk())
                .andReturn();

        List<TemplateDto> templates = objectMapper.readValue(tmplResult.getResponse().getContentAsString(),
                objectMapper.getTypeFactory().constructCollectionType(List.class, TemplateDto.class));
        assertEquals(4, templates.size());

        // ==========================================
        // 14. PDF EXPORT
        // ==========================================
        ExportResumeRequest exportReq = ExportResumeRequest.builder()
                .templateType(TemplateType.MODERN)
                .build();

        MvcResult exportResult = mockMvc.perform(post("/api/resumes/" + resumeId + "/export")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(exportReq)))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"))
                .andReturn();

        byte[] pdfBytes = exportResult.getResponse().getContentAsByteArray();
        assertTrue(pdfBytes.length > 500);
        assertEquals('%', (char) pdfBytes[0]);
        assertEquals('P', (char) pdfBytes[1]);
        assertEquals('D', (char) pdfBytes[2]);
        assertEquals('F', (char) pdfBytes[3]);

        // ==========================================
        // 15. DASHBOARD SUMMARY
        // ==========================================
        MvcResult dashResult = mockMvc.perform(get("/api/dashboard")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andReturn();

        DashboardResponse dashboard = objectMapper.readValue(dashResult.getResponse().getContentAsString(), DashboardResponse.class);
        assertEquals(1, dashboard.getTotalResumes());
        assertTrue(dashboard.getTotalVersions() >= 2);
        assertFalse(dashboard.getRecentActivity().isEmpty());
    }
}
