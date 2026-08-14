package com.verita.controller;

import com.verita.dto.export.ExportResumeRequest;
import com.verita.security.SecurityUtils;
import com.verita.service.PdfExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resumes/{id}/export")
@RequiredArgsConstructor
@Tag(name = "Resume Export", description = "Endpoints for exporting validated resumes to PDF format")
public class ExportController {

    private final PdfExportService pdfExportService;

    @PostMapping
    @Operation(summary = "Export resume to ATS-friendly PDF document with Fact Lock validation")
    public ResponseEntity<byte[]> exportPdf(
            @PathVariable String id,
            @RequestBody(required = false) ExportResumeRequest request
    ) {
        String userId = SecurityUtils.getCurrentUserId();
        byte[] pdfBytes = pdfExportService.exportResumePdf(id, userId, request);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "verita_resume.pdf");
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
