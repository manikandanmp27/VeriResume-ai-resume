package com.verita.controller;

import com.verita.dto.ats.ATSCheckRequest;
import com.verita.dto.ats.ATSCheckResponse;
import com.verita.security.SecurityUtils;
import com.verita.service.ATSAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resumes/{resumeId}/ats-check")
@RequiredArgsConstructor
@Tag(name = "ATS Reality Check", description = "Endpoints for ATS simulation, text extraction, formatting warnings, and section detection")
public class ATSController {

    private final ATSAnalysisService atsAnalysisService;

    @PostMapping
    @Operation(summary = "Run ATS parsing simulation on resume (or specific version)")
    public ResponseEntity<ATSCheckResponse> runAtsCheck(
            @PathVariable String resumeId,
            @RequestBody(required = false) ATSCheckRequest request
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ATSCheckResponse response = atsAnalysisService.runAtsCheck(resumeId, userId, request);
        return ResponseEntity.ok(response);
    }
}
