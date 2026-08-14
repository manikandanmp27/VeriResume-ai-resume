package com.verita.controller;

import com.verita.dto.version.CreateVersionRequest;
import com.verita.dto.version.ResumeVersionDto;
import com.verita.dto.version.VersionDiffResponse;
import com.verita.security.SecurityUtils;
import com.verita.service.ResumeVersionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes/{resumeId}/versions")
@RequiredArgsConstructor
@Tag(name = "Resume Versions & Diff", description = "Endpoints for managing multiple resume versions and viewing tailored diff comparisons")
public class ResumeVersionController {

    private final ResumeVersionService resumeVersionService;

    @GetMapping
    @Operation(summary = "List all saved versions for a resume")
    public ResponseEntity<List<ResumeVersionDto>> listVersions(@PathVariable String resumeId) {
        String userId = SecurityUtils.getCurrentUserId();
        List<ResumeVersionDto> versions = resumeVersionService.listVersions(resumeId, userId);
        return ResponseEntity.ok(versions);
    }

    @GetMapping("/{versionId}")
    @Operation(summary = "Get a specific resume version snapshot")
    public ResponseEntity<ResumeVersionDto> getVersion(
            @PathVariable String resumeId,
            @PathVariable String versionId
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeVersionDto version = resumeVersionService.getVersion(resumeId, versionId, userId);
        return ResponseEntity.ok(version);
    }

    @PostMapping
    @Operation(summary = "Create a manual version snapshot of the current resume content")
    public ResponseEntity<ResumeVersionDto> createVersion(
            @PathVariable String resumeId,
            @Valid @RequestBody CreateVersionRequest request
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        ResumeVersionDto created = resumeVersionService.createVersionSnapshot(resumeId, userId, request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{versionId}")
    @Operation(summary = "Delete a resume version snapshot")
    public ResponseEntity<Void> deleteVersion(
            @PathVariable String resumeId,
            @PathVariable String versionId
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        resumeVersionService.deleteVersion(resumeId, versionId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{versionId}/diff")
    @Operation(summary = "Get structured diff comparison between version and original/base resume")
    public ResponseEntity<VersionDiffResponse> getVersionDiff(
            @PathVariable String resumeId,
            @PathVariable String versionId
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        VersionDiffResponse diff = resumeVersionService.compareDiff(resumeId, versionId, userId);
        return ResponseEntity.ok(diff);
    }
}
