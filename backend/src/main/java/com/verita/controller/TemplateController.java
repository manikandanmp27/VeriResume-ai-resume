package com.verita.controller;

import com.verita.dto.template.TemplateDto;
import com.verita.service.TemplateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
@Tag(name = "Resume Templates", description = "Endpoints for retrieving ATS-optimized resume templates")
public class TemplateController {

    private final TemplateService templateService;

    @GetMapping
    @Operation(summary = "List all available resume templates with ATS compatibility scores")
    public ResponseEntity<List<TemplateDto>> listTemplates() {
        List<TemplateDto> templates = templateService.listTemplates();
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/{templateId}")
    @Operation(summary = "Get specific template details and schema")
    public ResponseEntity<TemplateDto> getTemplate(@PathVariable String templateId) {
        TemplateDto template = templateService.getTemplate(templateId);
        return ResponseEntity.ok(template);
    }
}
