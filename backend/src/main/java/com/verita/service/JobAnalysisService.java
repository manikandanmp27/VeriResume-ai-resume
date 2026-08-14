package com.verita.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.verita.ai.GeminiService;
import com.verita.dto.content.ResumeContentDto;
import com.verita.dto.job.*;
import com.verita.dto.version.VersionDiffResponse;
import com.verita.entity.JobAnalysis;
import com.verita.entity.Profile;
import com.verita.entity.Resume;
import com.verita.entity.ResumeVersion;
import com.verita.entity.SourceFact;
import com.verita.entity.enums.ResumeStatus;
import com.verita.entity.enums.VersionType;
import com.verita.exception.ForbiddenException;
import com.verita.exception.ResourceNotFoundException;
import com.verita.repository.*;
import com.verita.util.JsonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobAnalysisService {

    private final JobAnalysisRepository jobAnalysisRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeVersionRepository versionRepository;
    private final SourceFactRepository sourceFactRepository;
    private final ProfileRepository profileRepository;
    private final GeminiService geminiService;
    private final ResumeVersionService resumeVersionService;

    @Transactional
    public JobAnalysisResponse analyzeJob(String userId, AnalyzeJobRequest request) {
        Resume resume = null;
        ResumeContentDto content = new ResumeContentDto();
        List<SourceFact> facts = new ArrayList<>();

        if (request.getResumeId() != null && !request.getResumeId().isBlank()) {
            resume = resumeRepository.findById(request.getResumeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resume not found: " + request.getResumeId()));
            if (!resume.getUser().getId().equals(userId)) {
                throw new ForbiddenException("Unauthorized resume access");
            }
            content = JsonUtils.fromJson(resume.getContentJson(), ResumeContentDto.class);
            facts = sourceFactRepository.findByResumeIdOrderByCreatedAtAsc(resume.getId());
        }

        JsonNode analysisNode = geminiService.analyzeJobDescription(request.getJobDescription(), content, facts);

        String jobTitle = analysisNode.has("jobTitle") ? analysisNode.get("jobTitle").asText() : "Target Position";
        String company = analysisNode.has("company") ? analysisNode.get("company").asText() : "Target Company";
        List<String> importantSkills = parseStringList(analysisNode.get("importantSkills"));
        List<String> technologies = parseStringList(analysisNode.get("technologies"));
        List<String> qualifications = parseStringList(analysisNode.get("qualifications"));
        List<String> requirements = parseStringList(analysisNode.get("requirements"));
        List<String> supportedReqs = parseStringList(analysisNode.get("supportedRequirements"));
        List<String> missingReqs = parseStringList(analysisNode.get("missingRequirements"));
        int matchScore = analysisNode.has("matchScore") ? analysisNode.get("matchScore").asInt(75) : 75;

        JobAnalysis savedAnalysis = null;
        if (resume != null) {
            JobAnalysis entity = JobAnalysis.builder()
                    .resume(resume)
                    .jobTitle(jobTitle)
                    .company(company)
                    .rawJobDescription(request.getJobDescription())
                    .importantSkillsJson(JsonUtils.toJson(importantSkills))
                    .technologiesJson(JsonUtils.toJson(technologies))
                    .qualificationsJson(JsonUtils.toJson(qualifications))
                    .requirementsJson(JsonUtils.toJson(requirements))
                    .supportedRequirementsJson(JsonUtils.toJson(supportedReqs))
                    .missingRequirementsJson(JsonUtils.toJson(missingReqs))
                    .matchScore(matchScore)
                    .build();
            savedAnalysis = jobAnalysisRepository.save(entity);
        }

        return JobAnalysisResponse.builder()
                .id(savedAnalysis != null ? savedAnalysis.getId() : null)
                .resumeId(resume != null ? resume.getId() : null)
                .jobTitle(jobTitle)
                .company(company)
                .importantSkills(importantSkills)
                .technologies(technologies)
                .qualifications(qualifications)
                .requirements(requirements)
                .supportedRequirements(supportedReqs)
                .missingRequirements(missingReqs)
                .matchScore(matchScore)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Transactional(readOnly = true)
    public ResumeMatchResponse matchResume(String resumeId, String userId, ResumeMatchRequest request) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found: " + resumeId));
        if (!resume.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Unauthorized resume access");
        }

        ResumeContentDto content = JsonUtils.fromJson(resume.getContentJson(), ResumeContentDto.class);
        List<SourceFact> facts = sourceFactRepository.findByResumeIdOrderByCreatedAtAsc(resumeId);

        JsonNode node = geminiService.analyzeJobDescription(request.getJobDescription(), content, facts);

        List<String> importantSkills = parseStringList(node.get("importantSkills"));
        List<String> technologies = parseStringList(node.get("technologies"));
        List<String> supportedReqs = parseStringList(node.get("supportedRequirements"));
        List<String> missingReqs = parseStringList(node.get("missingRequirements"));
        int score = node.has("matchScore") ? node.get("matchScore").asInt(75) : 75;

        List<String> matchingSkills = new ArrayList<>();
        List<String> matchingTech = new ArrayList<>();
        String contentStr = JsonUtils.toJson(content).toLowerCase();

        for (String s : importantSkills) {
            if (contentStr.contains(s.toLowerCase())) {
                matchingSkills.add(s);
            }
        }
        for (String t : technologies) {
            if (contentStr.contains(t.toLowerCase())) {
                matchingTech.add(t);
            }
        }

        List<String> relevantSections = List.of("Skills", "Projects", "Experience", "Summary");
        List<String> suggestions = new ArrayList<>();
        if (!missingReqs.isEmpty()) {
            suggestions.add("Consider highlighting any coursework or personal projects that involve: " + String.join(", ", missingReqs));
        }
        suggestions.add("Use tailoring to position your verified competencies with role-aligned keywords.");

        return ResumeMatchResponse.builder()
                .resumeId(resumeId)
                .matchingSkills(matchingSkills)
                .matchingTechnologies(matchingTech)
                .matchingExperience(supportedReqs)
                .missingRequirements(missingReqs)
                .relevantResumeSections(relevantSections)
                .improvementSuggestions(suggestions)
                .internalMatchIndicator(score)
                .matchSummary("Internal alignment indicator based on extracted job requirements and verified resume facts.")
                .build();
    }

    @Transactional
    public TailorResumeResponse tailorResume(String resumeId, String userId, TailorResumeRequest request) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found: " + resumeId));
        if (!resume.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Unauthorized resume access");
        }

        ResumeContentDto originalContent = JsonUtils.fromJson(resume.getContentJson(), ResumeContentDto.class);
        List<SourceFact> facts = sourceFactRepository.findByResumeIdOrderByCreatedAtAsc(resumeId);

        JsonNode tailorNode = geminiService.tailorResume(
                request.getJobDescription(),
                originalContent,
                facts,
                request.getTargetRole() != null ? request.getTargetRole() : resume.getTargetRole()
        );

        ResumeContentDto tailoredContent = null;
        if (tailorNode.has("tailoredContent")) {
            tailoredContent = JsonUtils.fromJson(tailorNode.get("tailoredContent").toString(), ResumeContentDto.class);
        }
        if (tailoredContent == null) {
            tailoredContent = originalContent;
        }

        String changeSummary = tailorNode.has("changeSummary")
                ? tailorNode.get("changeSummary").asText()
                : "Tailored resume version created.";

        long count = versionRepository.countByResumeId(resumeId);
        int nextNum = (int) count + 1;
        String versionName = request.getVersionName() != null && !request.getVersionName().isBlank()
                ? request.getVersionName().trim()
                : "Tailored v" + nextNum + " (" + (request.getTargetRole() != null ? request.getTargetRole() : "Role") + ")";

        String tailoredJson = JsonUtils.toJson(tailoredContent);

        // Save new version
        ResumeVersion version = ResumeVersion.builder()
                .resume(resume)
                .versionNumber(nextNum)
                .versionName(versionName)
                .versionType(VersionType.JOB_TAILORED)
                .contentJson(tailoredJson)
                .changeSummary(changeSummary)
                .build();
        ResumeVersion savedVersion = versionRepository.save(version);

        resume.setContentJson(tailoredJson);
        resume.setStatus(ResumeStatus.TAILORED);
        resume.setCurrentVersionId(savedVersion.getId());
        if (request.getTargetRole() != null && !request.getTargetRole().isBlank()) {
            resume.setTargetRole(request.getTargetRole().trim());
        }
        resumeRepository.save(resume);

        List<VersionDiffResponse.DiffItem> diffs = resumeVersionService.computeContentDiff(originalContent, tailoredContent);

        return TailorResumeResponse.builder()
                .resumeId(resumeId)
                .versionId(savedVersion.getId())
                .versionNumber(nextNum)
                .versionName(versionName)
                .changeSummary(changeSummary)
                .changes(diffs)
                .tailoredContent(tailoredContent)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> parseStringList(JsonNode node) {
        if (node == null || !node.isArray()) return new ArrayList<>();
        List<String> list = new ArrayList<>();
        node.forEach(item -> list.add(item.asText()));
        return list;
    }
}
