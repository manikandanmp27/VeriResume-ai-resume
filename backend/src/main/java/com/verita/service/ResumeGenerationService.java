package com.verita.service;

import com.verita.ai.GeminiService;
import com.verita.dto.ai.GenerateResumeResponse;
import com.verita.dto.ai.ImproveContentRequest;
import com.verita.dto.ai.ImproveContentResponse;
import com.verita.dto.claim.FactLockOverviewDto;
import com.verita.dto.content.ResumeContentDto;
import com.verita.entity.Resume;
import com.verita.entity.ResumeVersion;
import com.verita.entity.SourceFact;
import com.verita.entity.enums.ResumeStatus;
import com.verita.entity.enums.VersionType;
import com.verita.repository.ResumeRepository;
import com.verita.repository.ResumeVersionRepository;
import com.verita.repository.SourceFactRepository;
import com.verita.util.JsonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResumeGenerationService {

    private final ResumeService resumeService;
    private final ResumeRepository resumeRepository;
    private final ResumeVersionRepository versionRepository;
    private final SourceFactRepository sourceFactRepository;
    private final SourceFactService sourceFactService;
    private final FactLockService factLockService;
    private final GeminiService geminiService;

    @Transactional
    public GenerateResumeResponse generateResume(String resumeId, String userId) {
        Resume resume = resumeService.getResumeEntity(resumeId, userId);

        ResumeContentDto currentContent = JsonUtils.fromJson(resume.getContentJson(), ResumeContentDto.class);
        if (currentContent == null) {
            currentContent = new ResumeContentDto();
        }

        // Ensure source facts are synced from current content
        sourceFactService.syncFactsFromResumeContent(resume, currentContent);
        List<SourceFact> facts = sourceFactRepository.findByResumeIdOrderByCreatedAtAsc(resume.getId());

        // Invoke AI generator with grounding rules
        ResumeContentDto generatedContent = geminiService.generateResumeContent(
                resume,
                currentContent,
                facts,
                resume.getTargetRole()
        );

        String generatedJson = JsonUtils.toJson(generatedContent);
        resume.setContentJson(generatedJson);
        resume.setStatus(ResumeStatus.GENERATED);

        // Determine next version number
        long count = versionRepository.countByResumeId(resume.getId());
        int nextVersionNum = (int) count + 1;

        ResumeVersion version = ResumeVersion.builder()
                .resume(resume)
                .versionNumber(nextVersionNum)
                .versionName("AI Generated v" + nextVersionNum)
                .versionType(VersionType.AI_GENERATED)
                .contentJson(generatedJson)
                .changeSummary("AI generated professional action bullets and summary based on user source facts.")
                .build();
        ResumeVersion savedVersion = versionRepository.save(version);

        resume.setCurrentVersionId(savedVersion.getId());
        Resume savedResume = resumeRepository.save(resume);

        // Extract and verify Fact Lock claims for the new content
        factLockService.extractAndVerifyClaims(savedResume, savedVersion.getId(), generatedContent);

        FactLockOverviewDto overview = factLockService.getClaimsOverview(resume.getId(), userId);

        return GenerateResumeResponse.builder()
                .resumeId(savedResume.getId())
                .versionId(savedVersion.getId())
                .status(savedResume.getStatus())
                .content(generatedContent)
                .factLockOverview(overview)
                .message("Resume generated successfully with Fact Lock verification.")
                .generatedAt(LocalDateTime.now())
                .build();
    }

    @Transactional(readOnly = true)
    public ImproveContentResponse improveContent(String resumeId, String userId, ImproveContentRequest request) {
        Resume resume = resumeService.getResumeEntity(resumeId, userId);
        List<SourceFact> facts = sourceFactRepository.findByResumeIdOrderByCreatedAtAsc(resume.getId());

        Map<String, String> result = geminiService.improveContent(
                request.getSection() != null ? request.getSection() : "general",
                request.getCurrentText(),
                request.getContext() != null ? request.getContext() : "",
                facts
        );

        String original = result.getOrDefault("originalText", request.getCurrentText());
        String improved = result.getOrDefault("improvedText", request.getCurrentText());
        String explanation = result.getOrDefault("explanation", "Improved wording and action verbs while keeping factual meaning intact.");

        return ImproveContentResponse.builder()
                .originalText(original)
                .improvedText(improved)
                .explanation(explanation)
                .changed(!original.trim().equalsIgnoreCase(improved.trim()))
                .build();
    }
}
