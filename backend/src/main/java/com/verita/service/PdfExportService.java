package com.verita.service;

import com.verita.dto.content.ResumeContentDto;
import com.verita.dto.export.ExportResumeRequest;
import com.verita.entity.Claim;
import com.verita.entity.Resume;
import com.verita.entity.ResumeVersion;
import com.verita.entity.enums.ClaimStatus;
import com.verita.entity.enums.TemplateType;
import com.verita.exception.BadRequestException;
import com.verita.exception.ForbiddenException;
import com.verita.exception.ResourceNotFoundException;
import com.verita.repository.ClaimRepository;
import com.verita.repository.ResumeRepository;
import com.verita.repository.ResumeVersionRepository;
import com.verita.util.JsonUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PdfExportService {

    private final ResumeRepository resumeRepository;
    private final ResumeVersionRepository versionRepository;
    private final ClaimRepository claimRepository;
    private final TemplateEngine templateEngine;

    @Transactional(readOnly = true)
    public byte[] exportResumePdf(String resumeId, String userId, ExportResumeRequest request) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found: " + resumeId));

        if (!resume.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to export this resume");
        }

        ResumeContentDto content;
        if (request != null && request.getVersionId() != null && !request.getVersionId().isBlank()) {
            final String versionId = request.getVersionId();
            ResumeVersion version = versionRepository.findByIdAndResumeId(versionId, resumeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Resume version not found: " + versionId));
            content = JsonUtils.fromJson(version.getContentJson(), ResumeContentDto.class);
        } else {
            content = JsonUtils.fromJson(resume.getContentJson(), ResumeContentDto.class);
        }

        if (content == null) {
            content = new ResumeContentDto();
        }

        // Check Fact Lock: filter out claims that have been rejected by the user
        List<Claim> rejectedClaims = claimRepository.findByResumeIdAndStatus(resumeId, ClaimStatus.REJECTED);
        if (!rejectedClaims.isEmpty()) {
            log.info("Sanitizing {} rejected claim(s) from PDF export for resume {}", rejectedClaims.size(), resumeId);
            content = sanitizeRejectedContent(content, rejectedClaims);
        }

        TemplateType templateType = (request != null && request.getTemplateType() != null)
                ? request.getTemplateType()
                : resume.getSelectedTemplate();

        Context context = new Context();
        context.setVariable("templateType", templateType.name());
        context.setVariable("personalInfo", content.getPersonalInfo());
        context.setVariable("skills", content.getSkills());
        context.setVariable("education", content.getEducation());
        context.setVariable("projects", content.getProjects());
        context.setVariable("experience", content.getExperience());
        context.setVariable("achievements", content.getAchievements());
        context.setVariable("certifications", content.getCertifications());

        String renderedHtml = templateEngine.process("resume-pdf", context);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(renderedHtml);
            renderer.layout();
            renderer.createPDF(outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            log.error("Failed to render PDF for resume {}: {}", resumeId, e.getMessage(), e);
            throw new BadRequestException("Failed to generate PDF document: " + e.getMessage());
        }
    }

    private ResumeContentDto sanitizeRejectedContent(ResumeContentDto content, List<Claim> rejectedClaims) {
        // Deep copy
        ResumeContentDto copy = JsonUtils.fromJson(JsonUtils.toJson(content), ResumeContentDto.class);
        if (copy == null) return content;

        List<String> rejectedTexts = rejectedClaims.stream()
                .map(c -> c.getClaimText().toLowerCase().trim())
                .toList();

        // Filter rejected bullets from projects
        if (copy.getProjects() != null) {
            for (var p : copy.getProjects()) {
                if (p.getBulletPoints() != null) {
                    p.setBulletPoints(p.getBulletPoints().stream()
                            .filter(bp -> !rejectedTexts.contains(bp.toLowerCase().trim()))
                            .toList());
                }
            }
        }

        // Filter rejected bullets from experience
        if (copy.getExperience() != null) {
            for (var exp : copy.getExperience()) {
                if (exp.getBulletPoints() != null) {
                    exp.setBulletPoints(exp.getBulletPoints().stream()
                            .filter(bp -> !rejectedTexts.contains(bp.toLowerCase().trim()))
                            .toList());
                }
            }
        }

        return copy;
    }
}
