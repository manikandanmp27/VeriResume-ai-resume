package com.verita.controller;

import com.verita.dto.resume.CreateResumeRequest;
import com.verita.dto.resume.ResumeResponse;
import com.verita.dto.resume.ResumeSummaryDto;
import com.verita.dto.resume.UpdateResumeRequest;
import com.verita.security.SecurityUtils;
import com.verita.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Tag(name = "Resume Management", description = "Endpoints for managing resumes, metadata, and status")
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping
    @Operation(summary = "List all resumes belonging to the authenticated user")
    public ResponseEntity<List<ResumeSummaryDto>> listResumes() {
        String userId = SecurityUtils.getCurrentUserId();
        List<ResumeSummaryDto> resumes = resumeService.listResumes(userId);
        return ResponseEntity.ok(resumes);
    }

    @PostMapping
    @Operation(summary = "Create a new resume")
    public ResponseEntity<ResumeResponse> createResume(@Valid @RequestBody CreateResumeRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeResponse response = resumeService.createResume(userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full resume details by ID")
    public ResponseEntity<ResumeResponse> getResume(@PathVariable String id) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeResponse response = resumeService.getResume(id, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update resume metadata (title, template, status, role)")
    public ResponseEntity<ResumeResponse> updateResume(
            @PathVariable String id,
            @Valid @RequestBody UpdateResumeRequest request
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeResponse response = resumeService.updateResume(id, userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a resume and all associated data")
    public ResponseEntity<Void> deleteResume(@PathVariable String id) {
        String userId = SecurityUtils.getCurrentUserId();
        resumeService.deleteResume(id, userId);
        return ResponseEntity.noContent().build();
    }
}
