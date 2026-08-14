package com.verita.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.verita.dto.content.*;
import com.verita.dto.version.CreateVersionRequest;
import com.verita.dto.version.ResumeVersionDto;
import com.verita.dto.version.VersionDiffResponse;
import com.verita.entity.Resume;
import com.verita.entity.ResumeVersion;
import com.verita.entity.enums.VersionType;
import com.verita.exception.BadRequestException;
import com.verita.exception.ForbiddenException;
import com.verita.exception.ResourceNotFoundException;
import com.verita.repository.ResumeRepository;
import com.verita.repository.ResumeVersionRepository;
import com.verita.util.JsonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeVersionService {

    private final ResumeVersionRepository versionRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeService resumeService;

    @Transactional(readOnly = true)
    public List<ResumeVersionDto> listVersions(String resumeId, String userId) {
        verifyResumeOwnership(resumeId, userId);
        return versionRepository.findByResumeIdOrderByVersionNumberDesc(resumeId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResumeVersionDto getVersion(String resumeId, String versionId, String userId) {
        verifyResumeOwnership(resumeId, userId);
        ResumeVersion version = versionRepository.findByIdAndResumeId(versionId, resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume version not found: " + versionId));
        return mapToDto(version);
    }

    @Transactional
    public ResumeVersionDto createVersionSnapshot(String resumeId, String userId, CreateVersionRequest request) {
        Resume resume = verifyResumeOwnership(resumeId, userId);

        long count = versionRepository.countByResumeId(resumeId);
        int nextNum = (int) count + 1;

        ResumeVersion version = ResumeVersion.builder()
                .resume(resume)
                .versionNumber(nextNum)
                .versionName(request.getVersionName().trim())
                .versionType(request.getVersionType() != null ? request.getVersionType() : VersionType.USER_EDITED)
                .contentJson(resume.getContentJson())
                .changeSummary(request.getChangeSummary() != null ? request.getChangeSummary().trim() : "Manual version snapshot created by user.")
                .build();

        ResumeVersion saved = versionRepository.save(version);
        resume.setCurrentVersionId(saved.getId());
        resumeRepository.save(resume);

        return mapToDto(saved);
    }

    @Transactional
    public void deleteVersion(String resumeId, String versionId, String userId) {
        Resume resume = verifyResumeOwnership(resumeId, userId);
        ResumeVersion version = versionRepository.findByIdAndResumeId(versionId, resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume version not found: " + versionId));

        if (version.getId().equals(resume.getCurrentVersionId())) {
            throw new BadRequestException("Cannot delete the active resume version.");
        }

        versionRepository.delete(version);
    }

    @Transactional(readOnly = true)
    public VersionDiffResponse compareDiff(String resumeId, String versionId, String userId) {
        verifyResumeOwnership(resumeId, userId);
        ResumeVersion targetVersion = versionRepository.findByIdAndResumeId(versionId, resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Target version not found: " + versionId));

        List<ResumeVersion> allVersions = versionRepository.findByResumeIdOrderByVersionNumberDesc(resumeId);
        ResumeVersion baseVersion = null;

        // Compare against previous version or the original version v1
        for (int i = 0; i < allVersions.size(); i++) {
            if (allVersions.get(i).getId().equals(versionId)) {
                if (i + 1 < allVersions.size()) {
                    baseVersion = allVersions.get(i + 1);
                } else if (allVersions.size() > 1) {
                    baseVersion = allVersions.get(allVersions.size() - 1);
                }
                break;
            }
        }

        if (baseVersion == null || baseVersion.getId().equals(targetVersion.getId())) {
            // Find lowest version number
            baseVersion = allVersions.stream()
                    .min((a, b) -> Integer.compare(a.getVersionNumber(), b.getVersionNumber()))
                    .orElse(targetVersion);
        }

        ResumeContentDto baseContent = JsonUtils.fromJson(baseVersion.getContentJson(), ResumeContentDto.class);
        ResumeContentDto targetContent = JsonUtils.fromJson(targetVersion.getContentJson(), ResumeContentDto.class);

        List<VersionDiffResponse.DiffItem> diffs = computeContentDiff(baseContent, targetContent);

        return VersionDiffResponse.builder()
                .baseVersionId(baseVersion.getId())
                .baseVersionName(baseVersion.getVersionName() + " (v" + baseVersion.getVersionNumber() + ")")
                .compareVersionId(targetVersion.getId())
                .compareVersionName(targetVersion.getVersionName() + " (v" + targetVersion.getVersionNumber() + ")")
                .overallSummary(targetVersion.getChangeSummary() != null ? targetVersion.getChangeSummary() : "Comparison between versions.")
                .differences(diffs)
                .build();
    }

    public List<VersionDiffResponse.DiffItem> computeContentDiff(ResumeContentDto base, ResumeContentDto target) {
        List<VersionDiffResponse.DiffItem> diffs = new ArrayList<>();
        if (base == null) base = new ResumeContentDto();
        if (target == null) target = new ResumeContentDto();

        // Summary diff
        String baseSum = base.getPersonalInfo() != null ? base.getPersonalInfo().getProfessionalSummary() : "";
        String targetSum = target.getPersonalInfo() != null ? target.getPersonalInfo().getProfessionalSummary() : "";
        if (baseSum == null) baseSum = "";
        if (targetSum == null) targetSum = "";
        if (!baseSum.trim().equals(targetSum.trim())) {
            diffs.add(VersionDiffResponse.DiffItem.builder()
                    .section("Summary")
                    .itemTitle("Professional Summary")
                    .changeType("MODIFIED")
                    .original(baseSum)
                    .changed(targetSum)
                    .reason("Summary wording adjusted to highlight role alignment.")
                    .build());
        }

        // Skills diff
        List<String> baseSkills = extractAllSkills(base.getSkills());
        List<String> targetSkills = extractAllSkills(target.getSkills());
        for (String ts : targetSkills) {
            if (!baseSkills.contains(ts)) {
                diffs.add(VersionDiffResponse.DiffItem.builder()
                        .section("Skills")
                        .itemTitle("Skill: " + ts)
                        .changeType("ADDED")
                        .original(null)
                        .changed(ts)
                        .reason("Skill highlighted for target role.")
                        .build());
            }
        }
        for (String bs : baseSkills) {
            if (!targetSkills.contains(bs)) {
                diffs.add(VersionDiffResponse.DiffItem.builder()
                        .section("Skills")
                        .itemTitle("Skill: " + bs)
                        .changeType("REMOVED")
                        .original(bs)
                        .changed(null)
                        .reason("Skill deprioritized for this specific version.")
                        .build());
            }
        }

        // Projects diff
        if (target.getProjects() != null) {
            for (ProjectDto tp : target.getProjects()) {
                ProjectDto bp = base.getProjects() != null
                        ? base.getProjects().stream().filter(p -> p.getTitle() != null && p.getTitle().equalsIgnoreCase(tp.getTitle())).findFirst().orElse(null)
                        : null;
                if (bp == null) {
                    diffs.add(VersionDiffResponse.DiffItem.builder()
                            .section("Projects")
                            .itemTitle("Project: " + tp.getTitle())
                            .changeType("ADDED")
                            .original(null)
                            .changed(tp.getTitle() + " - " + String.join(", ", tp.getTechnologies()))
                            .reason("Added project entry.")
                            .build());
                } else {
                    List<String> bBullets = bp.getBulletPoints() != null ? bp.getBulletPoints() : List.of();
                    List<String> tBullets = tp.getBulletPoints() != null ? tp.getBulletPoints() : List.of();
                    if (!bBullets.equals(tBullets)) {
                        diffs.add(VersionDiffResponse.DiffItem.builder()
                                .section("Projects")
                                .itemTitle("Project: " + tp.getTitle() + " (Bullet Points)")
                                .changeType("MODIFIED")
                                .original(String.join("\n• ", bBullets))
                                .changed(String.join("\n• ", tBullets))
                                .reason("Refined project impact bullets.")
                                .build());
                    }
                }
            }
        }

        return diffs;
    }

    private List<String> extractAllSkills(List<SkillCategoryDto> categories) {
        List<String> all = new ArrayList<>();
        if (categories != null) {
            for (SkillCategoryDto sc : categories) {
                if (sc.getSkills() != null) {
                    all.addAll(sc.getSkills());
                }
            }
        }
        return all;
    }

    private Resume verifyResumeOwnership(String resumeId, String userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found: " + resumeId));
        if (!resume.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this resume");
        }
        return resume;
    }

    public ResumeVersionDto mapToDto(ResumeVersion version) {
        ResumeContentDto content = null;
        if (version.getContentJson() != null && !version.getContentJson().isBlank()) {
            content = JsonUtils.fromJson(version.getContentJson(), ResumeContentDto.class);
        }
        if (content == null) content = new ResumeContentDto();

        return ResumeVersionDto.builder()
                .id(version.getId())
                .resumeId(version.getResume().getId())
                .versionNumber(version.getVersionNumber())
                .versionName(version.getVersionName())
                .versionType(version.getVersionType())
                .content(content)
                .changeSummary(version.getChangeSummary())
                .createdAt(version.getCreatedAt())
                .build();
    }
}
