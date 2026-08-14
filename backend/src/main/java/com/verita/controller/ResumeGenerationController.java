package com.verita.controller;

import com.verita.dto.ai.GenerateResumeResponse;
import com.verita.dto.ai.ImproveContentRequest;
import com.verita.dto.ai.ImproveContentResponse;
import com.verita.security.SecurityUtils;
import com.verita.service.ResumeGenerationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resumes/{id}")
@RequiredArgsConstructor
@Tag(name = "AI Resume Generation", description = "Endpoints for AI-powered resume generation and bullet point improvement")
public class ResumeGenerationController {

    private final ResumeGenerationService resumeGenerationService;

    @PostMapping("/generate")
    @Operation(summary = "Generate professional resume content grounded in source facts and initialize Fact Lock verification")
    public ResponseEntity<GenerateResumeResponse> generateResume(@PathVariable String id) {
        String userId = SecurityUtils.getCurrentUserId();
        GenerateResumeResponse response = resumeGenerationService.generateResume(id, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/improve")
    @Operation(summary = "Improve specific text or bullet point with proposed change preview")
    public ResponseEntity<ImproveContentResponse> improveContent(
            @PathVariable String id,
            @Valid @RequestBody ImproveContentRequest request
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ImproveContentResponse response = resumeGenerationService.improveContent(id, userId, request);
        return ResponseEntity.ok(response);
    }
}
