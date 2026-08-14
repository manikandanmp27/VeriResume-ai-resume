package com.verita.controller;

import com.verita.dto.content.*;
import com.verita.security.SecurityUtils;
import com.verita.service.ResumeContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes/{id}")
@RequiredArgsConstructor
@Tag(name = "Resume Content", description = "Endpoints for updating specific sections and full resume content")
public class ResumeContentController {

    private final ResumeContentService resumeContentService;

    @GetMapping("/content")
    @Operation(summary = "Get full structured resume content")
    public ResponseEntity<ResumeContentDto> getContent(@PathVariable String id) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeContentDto content = resumeContentService.getContent(id, userId);
        return ResponseEntity.ok(content);
    }

    @PutMapping("/content")
    @Operation(summary = "Update full structured resume content")
    public ResponseEntity<ResumeContentDto> updateFullContent(
            @PathVariable String id,
            @Valid @RequestBody ResumeContentDto content
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeContentDto updated = resumeContentService.updateFullContent(id, userId, content);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/personal-info")
    @Operation(summary = "Update personal contact info section")
    public ResponseEntity<ResumeContentDto> updatePersonalInfo(
            @PathVariable String id,
            @Valid @RequestBody PersonalInfoDto personalInfo
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeContentDto updated = resumeContentService.updatePersonalInfo(id, userId, personalInfo);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/education")
    @Operation(summary = "Update education section")
    public ResponseEntity<ResumeContentDto> updateEducation(
            @PathVariable String id,
            @RequestBody List<EducationDto> education
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeContentDto updated = resumeContentService.updateEducation(id, userId, education);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/skills")
    @Operation(summary = "Update skills section")
    public ResponseEntity<ResumeContentDto> updateSkills(
            @PathVariable String id,
            @RequestBody List<SkillCategoryDto> skills
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeContentDto updated = resumeContentService.updateSkills(id, userId, skills);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/projects")
    @Operation(summary = "Update projects section")
    public ResponseEntity<ResumeContentDto> updateProjects(
            @PathVariable String id,
            @RequestBody List<ProjectDto> projects
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeContentDto updated = resumeContentService.updateProjects(id, userId, projects);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/experience")
    @Operation(summary = "Update experience section")
    public ResponseEntity<ResumeContentDto> updateExperience(
            @PathVariable String id,
            @RequestBody List<ExperienceDto> experience
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeContentDto updated = resumeContentService.updateExperience(id, userId, experience);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/achievements")
    @Operation(summary = "Update achievements section")
    public ResponseEntity<ResumeContentDto> updateAchievements(
            @PathVariable String id,
            @RequestBody List<AchievementDto> achievements
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeContentDto updated = resumeContentService.updateAchievements(id, userId, achievements);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/certifications")
    @Operation(summary = "Update certifications section")
    public ResponseEntity<ResumeContentDto> updateCertifications(
            @PathVariable String id,
            @RequestBody List<CertificationDto> certifications
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeContentDto updated = resumeContentService.updateCertifications(id, userId, certifications);
        return ResponseEntity.ok(updated);
    }
}
