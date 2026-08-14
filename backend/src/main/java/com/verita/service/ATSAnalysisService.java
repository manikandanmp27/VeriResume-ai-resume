package com.verita.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.verita.ai.GeminiService;
import com.verita.dto.ats.ATSCheckRequest;
import com.verita.dto.ats.ATSCheckResponse;
import com.verita.dto.content.ResumeContentDto;
import com.verita.entity.ATSAnalysis;
import com.verita.entity.Resume;
import com.verita.entity.ResumeVersion;
import com.verita.exception.ForbiddenException;
import com.verita.exception.ResourceNotFoundException;
import com.verita.repository.ATSAnalysisRepository;
import com.verita.repository.ResumeRepository;
import com.verita.repository.ResumeVersionRepository;
import com.verita.util.JsonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ATSAnalysisService {

    private final ATSAnalysisRepository atsAnalysisRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeVersionRepository versionRepository;
    private final GeminiService geminiService;

    @Transactional
    public ATSCheckResponse runAtsCheck(String resumeId, String userId, ATSCheckRequest request) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found: " + resumeId));

        if (!resume.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this resume");
        }

        final String targetVersionId = (request != null && request.getVersionId() != null && !request.getVersionId().isBlank())
                ? request.getVersionId()
                : resume.getCurrentVersionId();

        ResumeContentDto content;
        if (request != null && request.getVersionId() != null && !request.getVersionId().isBlank()) {
            ResumeVersion version = versionRepository.findByIdAndResumeId(targetVersionId, resumeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Version not found: " + targetVersionId));
            content = JsonUtils.fromJson(version.getContentJson(), ResumeContentDto.class);
        } else {
            content = JsonUtils.fromJson(resume.getContentJson(), ResumeContentDto.class);
        }

        if (content == null) {
            content = new ResumeContentDto();
        }

        JsonNode atsNode = geminiService.atsCheck(content);

        String extractedText = atsNode.has("extractedText") ? atsNode.get("extractedText").asText() : "";
        List<String> detectedSections = parseStringList(atsNode.get("detectedSections"));
        List<String> extractedSkills = parseStringList(atsNode.get("extractedSkills"));
        List<String> extractedEdu = parseStringList(atsNode.get("extractedEducation"));
        List<String> extractedExp = parseStringList(atsNode.get("extractedExperience"));
        int parsingScore = atsNode.has("parsingScore") ? atsNode.get("parsingScore").asInt(90) : 90;
        List<String> warnings = parseStringList(atsNode.get("formattingWarnings"));
        List<String> problems = parseStringList(atsNode.get("parsingProblems"));
        List<String> missing = parseStringList(atsNode.get("missingSections"));

        ATSAnalysis entity = ATSAnalysis.builder()
                .resume(resume)
                .versionId(targetVersionId)
                .extractedText(extractedText)
                .detectedSectionsJson(JsonUtils.toJson(detectedSections))
                .extractedSkillsJson(JsonUtils.toJson(extractedSkills))
                .extractedEducationJson(JsonUtils.toJson(extractedEdu))
                .extractedExperienceJson(JsonUtils.toJson(extractedExp))
                .parsingScore(parsingScore)
                .formattingWarningsJson(JsonUtils.toJson(warnings))
                .parsingProblemsJson(JsonUtils.toJson(problems))
                .missingSectionsJson(JsonUtils.toJson(missing))
                .build();

        ATSAnalysis saved = atsAnalysisRepository.save(entity);

        return ATSCheckResponse.builder()
                .id(saved.getId())
                .resumeId(resumeId)
                .versionId(targetVersionId)
                .extractedText(extractedText)
                .detectedSections(detectedSections)
                .extractedSkills(extractedSkills)
                .extractedEducation(extractedEdu)
                .extractedExperience(extractedExp)
                .parsingScore(parsingScore)
                .formattingWarnings(warnings)
                .parsingProblems(problems)
                .missingSections(missing)
                .checkedAt(LocalDateTime.now())
                .build();
    }

    private List<String> parseStringList(JsonNode node) {
        if (node == null || !node.isArray()) return new ArrayList<>();
        List<String> list = new ArrayList<>();
        node.forEach(item -> list.add(item.asText()));
        return list;
    }
}
