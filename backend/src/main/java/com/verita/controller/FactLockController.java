package com.verita.controller;

import com.verita.dto.claim.ClaimDto;
import com.verita.dto.claim.FactLockOverviewDto;
import com.verita.dto.claim.UpdateClaimRequest;
import com.verita.security.SecurityUtils;
import com.verita.service.FactLockService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resumes/{resumeId}/claims")
@RequiredArgsConstructor
@Tag(name = "Fact Lock", description = "Endpoints for Fact Lock claim verification, approval, rejection, and anti-hallucination tracking")
public class FactLockController {

    private final FactLockService factLockService;

    @GetMapping
    @Operation(summary = "Get Fact Lock overview and all claims for a resume")
    public ResponseEntity<FactLockOverviewDto> getClaims(@PathVariable String resumeId) {
        String userId = SecurityUtils.getCurrentUserId();
        FactLockOverviewDto overview = factLockService.getClaimsOverview(resumeId, userId);
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/{claimId}")
    @Operation(summary = "Get a single claim by ID with supporting source facts")
    public ResponseEntity<ClaimDto> getClaim(
            @PathVariable String resumeId,
            @PathVariable String claimId
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ClaimDto claim = factLockService.getClaim(resumeId, claimId, userId);
        return ResponseEntity.ok(claim);
    }

    @PostMapping("/{claimId}/verify")
    @Operation(summary = "Approve / user-confirm an unverified claim")
    public ResponseEntity<ClaimDto> verifyClaim(
            @PathVariable String resumeId,
            @PathVariable String claimId
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ClaimDto verified = factLockService.verifyClaim(resumeId, claimId, userId);
        return ResponseEntity.ok(verified);
    }

    @PostMapping("/{claimId}/reject")
    @Operation(summary = "Reject a hallucinated or unwanted claim")
    public ResponseEntity<ClaimDto> rejectClaim(
            @PathVariable String resumeId,
            @PathVariable String claimId
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ClaimDto rejected = factLockService.rejectClaim(resumeId, claimId, userId);
        return ResponseEntity.ok(rejected);
    }

    @PutMapping("/{claimId}")
    @Operation(summary = "Update claim text, status, justification, or linked source facts")
    public ResponseEntity<ClaimDto> updateClaim(
            @PathVariable String resumeId,
            @PathVariable String claimId,
            @Valid @RequestBody UpdateClaimRequest request
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ClaimDto updated = factLockService.updateClaim(resumeId, claimId, userId, request);
        return ResponseEntity.ok(updated);
    }
}
