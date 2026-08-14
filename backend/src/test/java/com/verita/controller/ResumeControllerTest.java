package com.verita.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.verita.dto.content.ResumeContentDto;
import com.verita.dto.resume.CreateResumeRequest;
import com.verita.dto.resume.ResumeResponse;
import com.verita.dto.resume.ResumeSummaryDto;
import com.verita.dto.resume.UpdateResumeRequest;
import com.verita.entity.enums.ResumeStatus;
import com.verita.entity.enums.TemplateType;
import com.verita.security.JwtAuthenticationFilter;
import com.verita.security.JwtTokenProvider;
import com.verita.security.UserPrincipal;
import com.verita.service.ResumeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResumeController.class)
@AutoConfigureMockMvc(addFilters = false)
class ResumeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ResumeService resumeService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @BeforeEach
    void setUp() {
        UserPrincipal principal = new UserPrincipal("user-1", "user@test.com", "pass", "Test User",
                List.of(new SimpleGrantedAuthority("ROLE_USER")));
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("GET /api/resumes should return list of resumes for user")
    void listResumes_Success() throws Exception {
        ResumeSummaryDto summary = ResumeSummaryDto.builder()
                .id("resume-1")
                .title("Fullstack Resume")
                .targetRole("Fullstack Engineer")
                .selectedTemplate(TemplateType.MODERN)
                .status(ResumeStatus.DRAFT)
                .versionCount(2)
                .totalClaimsCount(5)
                .verifiedClaimsCount(4)
                .unverifiedClaimsCount(1)
                .updatedAt(LocalDateTime.now())
                .build();

        when(resumeService.listResumes("user-1")).thenReturn(List.of(summary));

        mockMvc.perform(get("/api/resumes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("resume-1"))
                .andExpect(jsonPath("$[0].title").value("Fullstack Resume"));
    }

    @Test
    @DisplayName("POST /api/resumes should create resume and return 201 Created")
    void createResume_Success() throws Exception {
        CreateResumeRequest request = CreateResumeRequest.builder()
                .title("Backend Resume")
                .targetRole("Java Developer")
                .selectedTemplate(TemplateType.TECHNICAL)
                .build();

        ResumeResponse response = ResumeResponse.builder()
                .id("resume-2")
                .userId("user-1")
                .title("Backend Resume")
                .targetRole("Java Developer")
                .selectedTemplate(TemplateType.TECHNICAL)
                .status(ResumeStatus.DRAFT)
                .content(new ResumeContentDto())
                .createdAt(LocalDateTime.now())
                .build();

        when(resumeService.createResume(eq("user-1"), any(CreateResumeRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/resumes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("resume-2"))
                .andExpect(jsonPath("$.title").value("Backend Resume"));
    }

    @Test
    @DisplayName("DELETE /api/resumes/{id} should delete resume and return 204 No Content")
    void deleteResume_Success() throws Exception {
        doNothing().when(resumeService).deleteResume("resume-1", "user-1");

        mockMvc.perform(delete("/api/resumes/resume-1"))
                .andExpect(status().isNoContent());
    }
}
