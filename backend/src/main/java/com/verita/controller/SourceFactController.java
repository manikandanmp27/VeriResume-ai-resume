package com.verita.controller;

import com.verita.dto.fact.CreateFactRequest;
import com.verita.dto.fact.SourceFactDto;
import com.verita.dto.fact.UpdateFactRequest;
import com.verita.security.SecurityUtils;
import com.verita.service.SourceFactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes/{resumeId}/facts")
@RequiredArgsConstructor
@Tag(name = "Source Facts", description = "Endpoints for managing structured grounding facts derived from user input")
public class SourceFactController {

    private final SourceFactService sourceFactService;

    @GetMapping
    @Operation(summary = "List all source facts for a resume")
    public ResponseEntity<List<SourceFactDto>> listFacts(@PathVariable String resumeId) {
        String userId = SecurityUtils.getCurrentUserId();
        List<SourceFactDto> facts = sourceFactService.listFacts(resumeId, userId);
        return ResponseEntity.ok(facts);
    }

    @PostMapping
    @Operation(summary = "Add a new source fact manually")
    public ResponseEntity<SourceFactDto> createFact(
            @PathVariable String resumeId,
            @Valid @RequestBody CreateFactRequest request
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        SourceFactDto created = sourceFactService.createFact(resumeId, userId, request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{factId}")
    @Operation(summary = "Update an existing source fact")
    public ResponseEntity<SourceFactDto> updateFact(
            @PathVariable String resumeId,
            @PathVariable String factId,
            @Valid @RequestBody UpdateFactRequest request
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        SourceFactDto updated = sourceFactService.updateFact(resumeId, factId, userId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{factId}")
    @Operation(summary = "Delete a source fact")
    public ResponseEntity<Void> deleteFact(
            @PathVariable String resumeId,
            @PathVariable String factId
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        sourceFactService.deleteFact(resumeId, factId, userId);
        return ResponseEntity.noContent().build();
    }
}
