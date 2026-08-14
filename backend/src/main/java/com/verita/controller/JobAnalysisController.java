package com.verita.controller;

import com.verita.dto.job.*;
import com.verita.security.SecurityUtils;
import com.verita.service.JobAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Job Description Analysis & Tailoring", description = "Endpoints for job description analysis, matching, and resume tailoring")
public class JobAnalysisController {

    private final JobAnalysisService jobAnalysisService;

    @PostMapping("/api/jobs/analyze")
    @Operation(summary = "Analyze job description and extract requirements, supported vs missing skills")
    public ResponseEntity<JobAnalysisResponse> analyzeJob(@Valid @RequestBody AnalyzeJobRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        JobAnalysisResponse response = jobAnalysisService.analyzeJob(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/resumes/{id}/match")
    @Operation(summary = "Compare resume with job description to compute internal matching indicator and suggestions")
    public ResponseEntity<ResumeMatchResponse> matchResume(
            @PathVariable String id,
            @Valid @RequestBody ResumeMatchRequest request
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeMatchResponse response = jobAnalysisService.matchResume(id, userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/resumes/{id}/tailor")
    @Operation(summary = "Generate a tailored resume version preserving original version and fact grounding")
    public ResponseEntity<TailorResumeResponse> tailorResume(
            @PathVariable String id,
            @Valid @RequestBody TailorResumeRequest request
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        TailorResumeResponse response = jobAnalysisService.tailorResume(id, userId, request);
        return ResponseEntity.ok(response);
    }
}
